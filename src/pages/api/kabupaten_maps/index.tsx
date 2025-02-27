import { supabase } from '../../../../lib/supabaseClient'; // Adjust path accordingly

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('kabupaten_maps') // Ensure the table name is correct
        .select('*');

      if (error) throw error;

      // Send the fetched data in the response
      return res.status(200).json(data); // Return fetched data
    } catch (error) {
      // Return an error response if the data fetching fails
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ message: 'Error fetching data', error: errorMessage });
    }
  } else {
    // Return method not allowed if not GET
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}