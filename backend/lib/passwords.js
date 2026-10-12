const bcryptPasswordHashPattern = /^\$2[aby]\$\d\d\$[./A-Za-z0-9]{53}$/;

export function isBcryptPasswordHash(value) {
    return typeof value === 'string' && bcryptPasswordHashPattern.test(value);
}
