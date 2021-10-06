import { Injectable } from "@angular/core";

@Injectable()
export class ValidateService {
    constructor() {}

    isRegisterInputValid(account) {
        if (!account.email || !account.password) {
            return this.getFailedResult(
                "Please capture the required fields fields"
            );
        }

        if (!this.isValidEmailAddress(account.email)) {
            return this.getFailedResult("Please enter a valid email address");
        }

        return this.isValidPassword(account.password, account.confirmPassword);
    }

    isValidPassword(password, confirmPassword) {
        if (password !== confirmPassword) {
            return this.getFailedResult(
                "Please make sure you confirm your password correctly"
            );
        }

        var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!regex.test(password)) {
            return this.getFailedResult(
                "Please make sure your password is minimum eight characters, at least one letter and one number"
            );
            
        }

        return this.getSuccessResult();
    }

    isLoginInputValid(user) {
        if (!user.email || !user.password) {
            return this.getFailedResult("Please capture all fields");
        }

        if (!this.isValidEmailAddress(user.email)) {
            return this.getFailedResult("Please enter a valid email address");
        }

        return this.getSuccessResult();
    }

    isProfileInputValid(user) {
        if (!user.name || !user.surname) {
            return this.getFailedResult("Please capture the required fields fields");
        }
        return this.getSuccessResult();
    }

    includesANumber(password) {
        
        return password.includes("0") 
            || password.includes("1")
            || password.includes("2")
            || password.includes("3")
            || password.includes("4")
            || password.includes("5")
            || password.includes("6")
            || password.includes("7")
            || password.includes("8")
            || password.includes("9");

    }

    isValidEmailAddress(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    getFailedResult(message) {
        return {
            isValid: false,
            message: message
        };
    }
    getSuccessResult() {
        return {
            isValid: true,
            message: ""
        };
    }
}
