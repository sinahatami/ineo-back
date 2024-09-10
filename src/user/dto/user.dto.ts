export class CreateUserDto {
    readonly username: string;
    readonly password: string
    readonly isAdmin?: boolean;
}

export class UpdateUserDto {
    readonly name: string;
    readonly password?: string;
    readonly isAdmin: boolean;
}
