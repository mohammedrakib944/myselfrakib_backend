const { unlink } = require("fs");
const path = require("path");
const slugify = require("slugify");
const conn = require("../middlewares/connection_DB");
const jose = require("jose");

// CREATE POST
exports.createPost = async (req, res, next) => {
  const { file, body } = req;
  const { title, short_ans, description, category, token } = body;

  // Verify Token
  if (!token) {
    // Delete Image
    if (file) {
      const filePath = path.join(
        __dirname,
        "/../public/uploads",
        file.filename
      );
      unlink(filePath, (err) => {
        if (err) {
          console.log("File delete failed: ", err);
        }
      });
    }
    return next("Please login!");
  }
  try {
    const secret = new TextEncoder().encode("rakib@^secret#key");
    await jose.jwtVerify(token, secret);
  } catch (err) {
    // Delete Image
    if (file) {
      const filePath = path.join(
        __dirname,
        "/../public/uploads",
        file.filename
      );
      unlink(filePath, (err) => {
        if (err) {
          console.log("File delete failed: ", err);
        }
      });
    }
    return next("You are not a valid user!");
  }

  // Make slug
  const slug = slugify(title, {
    lower: true,
  });
  let image = "";
  let img_name = "";
  if (file) {
    img_name = file.filename;
    image = `${process.env.API_BASE}/uploads/${file.filename}`;
  }
  const sqlQuery = `INSERT INTO posts(title, short_ans, description,image, category, slug, img_name) VALUES (?,?,?,?,?,?,?)`;
  conn.query(
    sqlQuery,
    [title, short_ans, description, image, category, slug, img_name],
    (err) => {
      if (err) {
        next(err);
      } else {
        res
          .status(200)
          .json({ status: "success", data: { ...body, image, slug } });
      }
    }
  );
};

// UPDATE POST
exports.updatePost = (req, res, next) => {
  const { id } = req.params;
  const { title, short_ans, description, category } = req.body;

  const findQuery = `SELECT * FROM posts WHERE id=?`;
  conn.query(findQuery, [id], (err, result) => {
    if (err || result.length === 0) {
      next("Couldn't get any posts!");
    } else {
      // Update Post
      const slug = slugify(title, {
        lower: true,
      });
      const sqlQuery = `UPDATE posts SET title=?, short_ans=?, description=?, category=?, slug=? WHERE id=?`;

      conn.query(
        sqlQuery,
        [title, short_ans, description, category, slug, id],
        (err) => {
          if (err) {
            next(err);
          } else {
            res
              .status(200)
              .json({ status: "success", data: { ...req.body, slug } });
          }
        }
      );
    }
  });
};

// GET POSTS
exports.getAllPosts = (req, res, next) => {
  const sqlQuery = `SELECT * FROM posts ORDER BY id DESC`;

  conn.query(sqlQuery, (err, result) => {
    if (err || result.length === 0) {
      next("Couldn't get any posts");
    } else {
      res.status(200).json({ status: "success", data: result });
    }
  });
};

// GET POSTS BY slug
exports.getAllPostsBySlug = (req, res, next) => {
  const { slug } = req.params;
  const sqlQuery = `SELECT * FROM posts WHERE slug=?`;
  conn.query(sqlQuery, [slug], (err, result) => {
    if (err || result.length === 0) {
      next("Couldn't get any post!");
    } else {
      res.status(200).json({ status: "success", data: result[0] });
    }
  });
};

// DELTE POST BY ID
exports.deletePostById = (req, res, next) => {
  const { id } = req.params;
  const sqlQuery = `SELECT * FROM posts WHERE id=?`;
  conn.query(sqlQuery, [id], (err, result) => {
    if (err || result.length === 0) {
      next("Couldn't get any posts!");
    } else {
      // Delete Image
      const { img_name } = result[0];
      if (img_name) {
        const filePath = path.join(__dirname, "/../public/uploads", img_name);
        unlink(filePath, (err) => {
          if (err) {
            console.log("File delete failed: ", err);
          }
        });
      }
      // Delete Post
      const deleteQuery = `DELETE FROM posts WHERE id=?`;
      conn.query(deleteQuery, [id], (err) => {
        if (err) {
          next("Couldn't delete Post!");
        } else {
          res.status(204).json({ status: "success" });
        }
      });
    }
  });
};
