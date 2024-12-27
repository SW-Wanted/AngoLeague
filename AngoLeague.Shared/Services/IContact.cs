using AngoLeague.Shared.Models;

namespace AngoLeague.Shared.Services
{
    public interface IContact
    {
        Task<List<MyContact>> GetAll();
        Task<MyContact?> GetContact();
    }
}
