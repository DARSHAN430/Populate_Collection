import { Controller, Get, Param } from '@nestjs/common';
import { LsdataService } from './lsdata.service';
import { Body, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { printTask } from 'src/crudOperation/dto/printTask.dto';
import { printNam } from './dto/PrintNam.dto';

@Controller('LSData')
export class LSDataController {
    // [x: string]: any;
    // lsdataService: any;
    // signUpDto: any;
    constructor(private readonly lsdata: LsdataService) { }

    @Post('signup')
    signup(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
        return this.lsdata.signUp(signUpDto)
    }

    @Post('login')
    login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return this.lsdata.login(loginDto);
    }

    @Get('PrintNam')
    async getAllData(): Promise<printNam[]> {
        const tasks = await this.lsdata.getAllData();
        return tasks;
    }

    @Get('UserIdByName/:name')
    async getUserIdByName(@Param('name') name: string) {
      try {
        const userId = await this.lsdata.getUserIdByName(name);
        if (userId) {
          return { userId };
        } else {
          return { message: 'User not found' };
        }
      } catch (error) {
        throw error;
      }
    }
}


// async login(@Body() loginDto : LoginDto) {
//     const token = await this.lsdataService.login(loginDto);
//     return { token };