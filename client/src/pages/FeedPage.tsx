import useLogout from '@/hooks/useLogout';

const FeedPage = () => {
  const { handleLogout } = useLogout();
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Project Shomadhan - Feed page</h1>
      <button
        onClick={handleLogout}
        className="btn btn-error w-64 rounded-full"
      >
        Log out
      </button>
    </div>
  );
};

export default FeedPage;
