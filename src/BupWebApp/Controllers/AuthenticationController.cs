using Bup.WebApp.Models;
using Bup.WebApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace Bup.WebApp.Controllers;

[ApiController]
[ApiVersion("1")]
[Route("/api/v{version:apiVersion}/[controller]")]
public class AuthenticationController: ControllerBase
{
    private readonly IUserService _userService;

    public AuthenticationController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    public IActionResult Authenticate(AuthenticateRequest model)
    {
        var response = _userService.Authenticate(model);

        if (response == null)
            return BadRequest(new { message = "Username or password is incorrect" });

        return Ok(response);
    }
    
}