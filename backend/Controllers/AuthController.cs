﻿using backend.Authentication;
using backend.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> usermanager;
        private readonly RoleManager<IdentityRole> rolemanager;
        private readonly IConfiguration config;
        public AuthController(UserManager<User> usermanager, RoleManager<IdentityRole> rolemanager, IConfiguration config)
        {
            this.usermanager = usermanager;
            this.rolemanager = rolemanager;
            this.config = config;
            AuthModel admin = new AuthModel()
            {
                Email = "admin@gmail.com",
                Password = "Admin123"
            };
            RegisterAdmin(admin);
        }

        [EnableCors("CorsPolicy")]
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] AuthModel model)
        {
            var exist = await usermanager.FindByNameAsync(model.Email);
            if (exist != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists" });
            User user = new User()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Email,
                IsAdmin = false
            };
            var result = await usermanager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed" });
            }

            var authClaim = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };
            var userRoles = await usermanager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authClaim.Add(new Claim(ClaimTypes.Role, role));
            }
            var authKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Secret"]));
            var token = new JwtSecurityToken(
                issuer: config["JWT:ValidIssuer"],
                audience: config["JWT:ValidAudience"],
                expires: DateTime.Now.AddDays(5),
                claims: authClaim,
                signingCredentials: new SigningCredentials(authKey, SecurityAlgorithms.HmacSha256)
                );

            return Ok(new { 
                email = user.Email,
                id = user.Id,
                _token = new JwtSecurityTokenHandler().WriteToken(token),
                isAdmin = false
            });
        }

        public async Task<IActionResult> RegisterAdmin(AuthModel model)
        {
            var exist = await usermanager.FindByNameAsync(model.Email);
            if (exist != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists" });
            User user = new User()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Email,
                IsAdmin = true
            };
            var result = await usermanager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed" });
            }

            if (!await rolemanager.RoleExistsAsync(UserRoles.Admin))
                await rolemanager.CreateAsync(new IdentityRole(UserRoles.Admin));
            if (!await rolemanager.RoleExistsAsync(UserRoles.User))
                await rolemanager.CreateAsync(new IdentityRole(UserRoles.User));
            if (await rolemanager.RoleExistsAsync(UserRoles.Admin))
            {
                await usermanager.AddToRoleAsync(user, UserRoles.Admin);
            }
            return Ok();
        }

        [EnableCors("CorsPolicy")]
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] AuthModel model)
        {
            var user = await usermanager.FindByEmailAsync(model.Email);
            if (user != null && await usermanager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await usermanager.GetRolesAsync(user);
                bool isAdmin = await usermanager.IsInRoleAsync(user, UserRoles.Admin);
                var authClaim = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };
                foreach (var role in userRoles)
                {
                    authClaim.Add(new Claim(ClaimTypes.Role, role));
                }
                var authKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Secret"]));
                var token = new JwtSecurityToken(
                    issuer: config["JWT:ValidIssuer"],
                    audience: config["JWT:ValidAudience"],
                    expires: DateTime.Now.AddDays(5),
                    claims : authClaim,
                    signingCredentials: new SigningCredentials(authKey, SecurityAlgorithms.HmacSha256)
                    );
                return Ok(new
                {
                    userid = user.Id,
                    email = user.Email,
                    _token = new JwtSecurityTokenHandler().WriteToken(token),
                    isAdmin = isAdmin
                });
            }
            return Unauthorized();
        }
    }
}
