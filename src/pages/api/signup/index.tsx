import { supabase } from "../../../../lib/supabaseClient"; // Sesuaikan path
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { email, password, username, instansi } = req.body;

      // Sign up user via Supabase Auth
      const { data: user, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !user) {
        return res.status(400).json({ message: "Sign-up failed", error: authError?.message });
      }

      // Insert user data into 'users' table
      const { error: dbError } = await supabase.from("users").insert([
        {
          auth_id: user.user?.id, // Gunakan ID dari auth user
          username,
          email,
          instansi,
        },
      ]);

      if (dbError) {
        return res.status(500).json({ message: "Database error", error: dbError.message });
      }

      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
