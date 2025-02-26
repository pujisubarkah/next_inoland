import { supabase } from '../../../../lib/supabaseClient'; // Adjust path accordingly

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('beritas') // Ensure the table name is correct
        .select('*');

      if (error) throw error;

      // Send the fetched data in the response
      return res.status(200).json(data);
    } catch (error) {
      // Return an error response if the data fetching fails
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ message: 'Error fetching data', error: errorMessage });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, date, image_url, deskripsi } = req.body;
      
      if (!title || !date || !image_url || !deskripsi) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      // Insert data into Supabase
      const { data, error } = await supabase
        .from('beritas')
        .insert([{ title, date, image_url, deskripsi }])
        .select();
      
      if (error) throw error;
      
      return res.status(201).json({ message: 'Data inserted successfully', data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ message: 'Error inserting data', error: errorMessage });
    }
  } else {
    // Return method not allowed if not GET or POST
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
