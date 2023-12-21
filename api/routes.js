"use strict";

const express = require("express");
const router = express.Router();
const { User, Course } = require("./models");
const { authenticateUser } = require("./middleware/authUser");

// Helper function (to handle asynchronous routes)
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// GET /api/users
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    // Filter out unnecessary properties
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  })
);

// POST /api/users
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location("/").end();
    } catch (error) {
      console.log(error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// GET /api/courses
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(courses);
  })
);

// GET /api/courses/:id
router.get(
  "/courses/:id",
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ["firstName", "lastName", "emailAddress"],
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (course) {
      res.json(course).status(200);
    } else {
      const error = new Error("The course was not found");
      error.status = 404;
      next(error);
    }
  })
);

// POST /api/courses
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    try {
      const course = await Course.create(req.body);
      if (!course.title || !course.description) {
        const error = new Error("Title and description are required");
        error.status = 400;
        next(error);
      }
      res.status(201).location(`/courses/${course.id}`).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// PUT /api/courses/:id
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    if (course && course.userId === req.currentUser.id) {
      try {
        await course.update(req.body);
        res.status(204).end();
      } catch (error) {
        if (error.name === "SequelizeValidationError") {
          // Handle validation errors
          const errors = error.errors.map((err) => err.message);
          res.status(400).json({ errors });
        } else {
          // Handle other errors
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    } else {
      res
        .status(403)
        .json({ message: "Access denied. User does not own the course." });
    }
  })
);

// DELETE /api/courses/:id
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    if (course && course.userId === req.currentUser.id) {
      await course.destroy();
      res.status(204).end();
    } else {
      res
        .status(403)
        .json({ message: "Access denied. User does not own the course." });
    }
  })
);

module.exports = router;
