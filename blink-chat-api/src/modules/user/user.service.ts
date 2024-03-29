import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { USER_MESSAGE } from '../../utils/responseMessages';
import { JwtService } from '@nestjs/jwt';

const PASSWORD_GEN_SALT_COUNT = 12;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const foundUserByEmail = await this.findOne(createUserDto.email);

    if (foundUserByEmail) {
      throw new BadRequestException(USER_MESSAGE.USER_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      PASSWORD_GEN_SALT_COUNT,
    );
    const createUserObj = {
      ...createUserDto,
      password: hashedPassword,
    };
    const createdUserObj = await this.prisma.user.create({
      data: createUserObj,
    });

    const userDetails = {
      email: createdUserObj.email,
      name: `${createdUserObj.firstName} ${createdUserObj.lastName}`,
    };
    const accessToken = await this.jwtService.signAsync(userDetails);
    return { ...createdUserObj, accessToken };
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(email);

    if (!user) {
      throw new BadRequestException(USER_MESSAGE.NOT_FOUND);
    }

    return this.prisma.user.update({ where: { email }, data: updateUserDto });
  }

  async remove(email: string) {
    const user = await this.findOne(email);

    if (!user) {
      throw new BadRequestException(USER_MESSAGE.NOT_FOUND);
    }

    return this.prisma.user.delete({ where: { email } });
  }
}
