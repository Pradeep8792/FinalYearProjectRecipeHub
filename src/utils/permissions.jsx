export const isAdmin = (user) => user?.role === 'Admin'
export const isOwner = (user, userId) => Number(user?.userId) === Number(userId)

