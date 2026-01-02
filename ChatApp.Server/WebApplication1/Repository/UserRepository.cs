namespace WebApplication1.Repository
{
    public interface IUserRepository
    {
        Task<bool> IsAllowed(string userId);
    }

    public class UserRepository : IUserRepository
    {
        // This implementation is a mock for the database. In production, this would connect to the DB.
        private readonly HashSet<string> _allowedUsers = new()
        {
            "123456782",
            "111111118",
            "222222226",
            "333333334",
            "444444442",
            "555555556",
            "666666664",
            "777777772",
            "888888880",
            "999999998"
        };

        
        public Task<bool> IsAllowed(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return Task.FromResult(false);

            var result = _allowedUsers.Contains(userId.Trim());
            return Task.FromResult(result);
        }
    }
}
