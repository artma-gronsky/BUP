using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bup.Infrastructure.DbContext;
using Bup.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Bup.Infrastructure.Repositories
{
    public class BaseGenericRepository<T>: IBaseGenericRepository<T> where T: class, IEntity
    {
        private readonly BupDbContext _context;

        public BaseGenericRepository(BupDbContext context)
        {
            _context = context;
        }
        
        public IEnumerable<T> GetAll()
        {
            return _context.Set<T>();
        }

        public Task<T> GetById(Guid id)
        {
            return _context.Set<T>().SingleOrDefaultAsync(s => s.Id == id);
        }

        public async Task<T> Insert(T entity)
        {
            var result = await _context.Set<T>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<T> Update(T entity)
        {
            var updatedEntity = _context.Set<T>().Update(entity);
            await _context.SaveChangesAsync();
            return updatedEntity.Entity;
        }
        
        public async Task<T> Delete(Guid id)
        {
            T entity = _context.Set<T>().SingleOrDefault(s => s.Id == id);

            if (entity == null) return null;
            
            var removedEntity = _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();
            return removedEntity.Entity;
        }
    }
}