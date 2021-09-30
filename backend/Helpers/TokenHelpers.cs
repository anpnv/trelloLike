using System;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace prid_2021_g01.Helpers
{
    public static class TokenHelper
    {
        public static string GetPasswordHash(string password)
        {
            // var hasher = new PasswordHasher<User>();
            // return hasher.HashPassword(null, password);

            string salt = "Peodks;zsOK30S,s";
            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: Encoding.UTF8.GetBytes(salt),
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
            return hashed;
        }
    }
}