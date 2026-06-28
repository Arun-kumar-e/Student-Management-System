package com.Arun.StudentManagement.exception;

public class DuplicateRollNumberException extends RuntimeException{
    public DuplicateRollNumberException(String message){
        super(message);
    }
}
