using AngoLeague.Shared.Services;
using AngoLeague.Shared.Models;

namespace AngoLeague.Services
{
    public class ContactService : IContact
    {
        public async Task<List<MyContact>> GetAll()
        {
            var permission = await IsGranted();
            if (!permission)
                throw new UnauthorizedAccessException("Você não está autorizado!");
            
            var allContacts = await Microsoft.Maui.ApplicationModel.Communication.Contacts.Default.GetAllAsync();

            return allContacts.Select(c => new MyContact
            {
                Name = c.GivenName,
                PhoneNumber = c.Phones.FirstOrDefault()!.PhoneNumber,
                Email = c.Emails.FirstOrDefault()!.EmailAddress,
                Id = c.Id
            }).ToList();
        }
        public async Task<MyContact?> GetContact()
        {
            var permission = await IsGranted();
            if (!permission)
                throw new UnauthorizedAccessException("Você não está autorizado!");

            var contact = await Microsoft.Maui.ApplicationModel.Communication.Contacts.Default.PickContactAsync();

            return (contact is null) ? null : new MyContact
            {
                Name = contact.GivenName,
                PhoneNumber = contact.Phones.FirstOrDefault()!.PhoneNumber,
                Email = contact.Emails.FirstOrDefault()!.EmailAddress,
                Id = contact.Id
            };
        }

        private async Task<bool> IsGranted()
        {
            var permission = await Permissions.RequestAsync<Permissions.ContactsRead>();
            return permission == PermissionStatus.Granted;
        }
    }
}
