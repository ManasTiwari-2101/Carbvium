const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Admin client for server operations
const supabaseAdmin = require("./supabase_client");

// Auth client for user authentication
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Signup endpoint handler
const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ 
        error: "Email, password, and username are required" 
      });
    }

    // Create user with Admin client (auto-confirms email)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Store user profile using admin client
    const { error: insertError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          id: data.user.id,
          email,
          username
        }
      ]);

    if (insertError) {
      console.error("Error storing user profile:", insertError);
    }

    res.status(201).json({
      message: "User created successfully!",
      user: {
        id: data.user.id,
        email: data.user.email,
        username
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login endpoint handler
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Authenticate user with Auth client
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }

    // Get user profile
    const { data: userProfile } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    res.status(200).json({
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
        username: userProfile?.username || data.user.user_metadata?.username
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Logout endpoint handler
const logout = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ 
        error: "Access token is required" 
      });
    }

    // Sign out user using admin client
    const { error } = await supabaseAdmin.auth.admin.signOut(access_token);

    if (error) {
      console.error("Logout error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout
};
