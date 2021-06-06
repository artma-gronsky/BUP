using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Bup.Infrastructure.Entities;

namespace Bup.Infrastructure.Repositories
{
    public interface IBaseGenericRepository<T> where T: IEntity
    {
        IEnumerable<T> GetAll();

        Task<T> GetById(Guid id);

        Task<T> Insert(T entity);

        Task<T> Update(T entity);

        Task<T> Delete(Guid id);
    }
}