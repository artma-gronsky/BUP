using System;
using Bup.Infrastructure.Entities;

namespace Bup.WebApp.Models
{
    public class AuthenticateResponse
    {
        public Guid Id { get; }
        public string FirstName { get; }
        public string LastName { get; }
        public string Username { get; }
        public string Token { get; }


        public AuthenticateResponse(User user, string token)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Username = user.Username;
            Token = token;
        }
    }
}