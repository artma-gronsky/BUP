using System;
using System.Collections.Generic;
using Bup.Infrastructure.Entities;
using Bup.WebApp.Models;

namespace Bup.WebApp.Services
{
    public interface IUserService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model);
        
        List<User> GetAll();
        
        User GetById(Guid id);
    }
}