const User = require('../Schema/User');

// =========================
// GET ALL USERS
// =========================
exports.getAllUsers = async (req, res) => {

  try {

    const users = await User.find().select('-password');

    res.status(200).json(users);

  } catch (err) {



    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// =========================
// GET USER BY ID
// =========================
exports.getUserById = async (req, res) => {

  try {

   

    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {

      return res.status(404).json({
        success: false,
        message: 'User not found'
      });

    }

    res.status(200).json(user);

  } catch (err) {

   

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// =========================
// UPDATE USER
// =========================
exports.updateUser = async (req, res) => {

  try {

    const { nom, prenom, email, role, theme } = req.body;

    const updated = await User.findByIdAndUpdate(

      req.params.id,

      {
        $set: {
          nom,
          prenom,
          email,
          role,
          theme
        }
      },

      {
        returnDocument: 'after',
        runValidators: true
      }

    ).select('-password');

    // =========================
    // USER NOT FOUND
    // =========================
    if (!updated) {

      

      return res.status(404).json({
        success: false,
        message: 'User not found'
      });

    }

   

    res.status(200).json({
      success: true,
      user: updated
    });

  } catch (err) {

   

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// =========================
// DELETE USER
// =========================
exports.deleteUser = async (req, res) => {

  try {



    // =========================
    // DELETE USER
    // =========================
    const deleted = await User.findByIdAndDelete(req.params.id);

    // =========================
    // USER NOT FOUND
    // =========================
    if (!deleted) {

     

      return res.status(404).json({
        success: false,
        message: 'User not found'
      });

    }

   

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: deleted
    });

  } catch (err) {


    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};