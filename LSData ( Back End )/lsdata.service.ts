import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sdata } from './Chema/sdata.Schema';
import { Model } from 'mongoose';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { printTask } from 'src/crudOperation/dto/printTask.dto';
import { printNam } from './dto/PrintNam.dto';
// import { LsdataModule } from './lsdata.module';

@Injectable()
export class LsdataService {
    // userModel: any;
    constructor(
        @InjectModel(sdata.name)
        private sdataModule: Model<sdata>,
        private jwtService: JwtService,
    ) { }

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password } = signUpDto

        const exist = await this.sdataModule.findOne({ email });

        if (exist) {
            throw new ConflictException('Email is already exists');
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);

        const user = await this.sdataModule.create({
            name,
            email,
            password: hashedPassword
        });

        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }



    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        const user = await this.sdataModule.findOne({ email })

        if (!user) {
            throw new UnauthorizedException(' Invalid email or password')
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }


    async getAllData(): Promise<printNam[]> {
        try {
            // Use the Mongoose model to fetch data from the MongoDB collection
            const tasks = await this.sdataModule.find();
            return tasks;
        } catch (error) {
            throw error;
        }
    }

    async getUserIdByName(user_name: string): Promise<string | null> {
        try {
          const userData = await this.sdataModule.findOne({ name: user_name }).exec();
          return userData ? userData._id.toString() : null; // Convert ObjectId to string
        } catch (error) {
          throw error;
        }
      }
}
