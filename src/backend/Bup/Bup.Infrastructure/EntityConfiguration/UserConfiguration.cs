using Bup.Common;
using Bup.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bup.Infrastructure.EntityConfiguration
{
    public class UserConfiguration:IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");
            
            builder.HasKey(o => o.Id);
            
            builder.Property(o => o.Username).IsRequired().HasMaxLength(50);
            
            builder.Property(o => o.Password)
                .HasConversion(o =>  StringCipher.Encrypt(o, typeof(User).ToString()),
                    o => StringCipher.Decrypt(o,typeof(User).ToString()))
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(o => o.FirstName);

            builder.Property(o => o.LastName);

        }
    }
}