import app from './app.ts';

const PORT: number = parseInt(process.env.PORT || '3001', 10);

if (isNaN(PORT)) {
  console.error('Error: Invalid PORT environment variable. Exiting.');
  process.exit(1);
}

try {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error(
    `Error starting server: ${error instanceof Error ? error.message : 'Unknown error'}`
  );
  process.exit(1);
}
