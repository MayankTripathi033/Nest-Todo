import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import type { User } from '@prisma/client';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'password123' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Login successful, returns JWT token' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'password123' },
                name: { type: 'string', example: 'John Doe' },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    register(@Body() registerDto: User) {
        return this.usersService.createUser(registerDto);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Returns user profile' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getProfile(@Request() req: { user: User }) {
        const { password, ...result } = req.user;
        return result;
    }
}
