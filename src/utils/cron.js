import cron from 'node-cron';
import axios from 'axios';

// Function to setup the cron job
export const startCronJob = () => {
  cron.schedule('*/14 * * * *', async () => {
    try {
      // Send a GET request to keep the app alive (adjust the URL to match your endpoint)
      const response = await axios.get('https://booknest-backend-7tfy.onrender.com/');
      console.log('Ping successful:', response.data);
    } catch (error) {
      console.error('Error pinging the app:', error.message);
    }
  });

  console.log('Cron job started: Job will run every 14 minutes');
};
