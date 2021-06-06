using System.Threading.Tasks;
using Bup.Infrastructure.Entities;
using Bup.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Bup.WebApp.Controllers
{
    
    [ApiController]
    [ApiVersion("1")]
    [Route("v{version:apiVersion}/[controller]")]
    public class UsersController:ControllerBase
    {
        private readonly IBaseGenericRepository<User> _users;
        public UsersController(IBaseGenericRepository<User> users)
        {
            _users = users;
        }

        [HttpPut]
        public async Task<IActionResult> AddNewUser(User user)
        {
            var result = await _users.Insert(user);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var result = _users.GetAll();
            return Ok(result);
        }
    }
}