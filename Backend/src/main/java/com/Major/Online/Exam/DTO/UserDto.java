package com.Major.Online.Exam.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserDto {
    String name;
    String email;
    String password;
    String role;
    String profile;
}
