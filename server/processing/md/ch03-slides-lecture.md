## Decision Structures



Prof Clark


COSC 1437


#### Topics covered in Chapter 3


#### The if Statement


The if statement decides whether a section of


code executes or not.


The if statement uses a `boolean` to decide


whether the next statement or block of

statements executes.


_if (boolean expression is true)_


_execute next statement._


#### `if` Statement Example

C++
```
  if (score >= 90)

  {

  grade = 'A';

  cout << "Good Job!\n";

  }

```

Java

```
  if (score >= 90)

  {

  grade = 'A';

  System.out.println("Good Job!");

  }

```

#### - `if else` Statements

        The `if` `else` statement adds the

ability to conditionally execute
code when the `if` condition is false.

```
    if ( expression )

      statementOrBlockIfTrue ;

    else

      statementOrBlockIfFalse ;

```

#### `if-else` Statement Example

C++

```
int number;

cout << "Enter a number: ";

cin >> number;

if (number % 2 == 0)

cout << number << " is even\n";

else

cout << number << " is odd\n";

```

#### `if-else` Statement Example

Java


#### Nested if Statements

If an `if` statement appears


condition.


#### Nested if Statement Example

C++
```
//Determine the user¡¯s loan qualifications.
if (employed == ¡®Y¡¯)

{

if (recentGrad == ¡®Y¡¯)

{

cout << "You qualify for the special ";
cout << "interest rate.\n";

}

}

```

#### Nested if Statement Example

Java




#### Nested if Statements Practice

```
int num;

Scanner kbd = new Scanner(System.in);

num = kbd.nextInt();

if (num > 0)

{

System.out.println("Chocolate");

if (num > 10)

System.out.println("Vanilla");

}

else

{

System.out.println("Strawberry");

}

```

##### What prints if the user enters: 5? 10? 15? 0?


#### - - `if else if` Statements


 Nested `if` statements can

 - - 
statement.


## TestResults.java


#### Logical Operators






|Operator|Meaning|Effect|
|---|---|---|
|**`&&`**|**AND**|Connects two`boolean` expressions into one. Both<br>expressions must be true for the overall expression to<br>be true.|
|**`||`**|**OR**|Connects two`boolean` expressions into one. One or<br>both expressions must be true for the overall<br>expression to be true. It is only necessary for one to be<br>true, and it does not matter which one.|
|**`!`**|**NOT**|The ! operator reverses the truth of a`boolean` <br>expression.  If it is applied to an expression that is<br>true, the operator returns false. If it is applied to an<br>expression that is false, the operator returns true.|


#### The && Operator


- `&&`
The logical AND operator ( ) takes two operands that
must both be `boolean` expressions.


The resulting combined expression is true if (and _only_
if) both operands are true.


|Expression 1|Expression 2|Expression1 && Expression2|
|---|---|---|
|**true**|**false**|**false**|
|**false**|**true**|**false**|
|**false**|**false**|**false**|
|**true**|**true**|**true**|
||||


#### The || Operator


The logical OR operator ( `||` ) takes two operands that
must both be `boolean` expressions.


The resulting combined expression is false if (and _only_
if) both operands are false.


|Expression 1|Expression 2|Expression1 || Expression2|
|---|---|---|
|**true**|**false**|**true**|
|**false**|**true**|**true**|
|**false**|**false**|**false**|
|**true**|**true**|**true**|
||||


#### The ! Operator

 The `!` operator performs a logical NOT operation.


 If an _`expression`_ is true, `!` _`expression`_ will be false.

```
   if (!(temperature > 100))

     System.out.println("Below the maximum temperature.");

```

 If **`temperature > 100`** evaluates to false, then the output statement will be run.


|Col1|Col2|
|---|---|
|**Expression 1**|**!Expression1**|
|**true**|**false**|
|**false**|**true**|
|||


#### Let¡¯s play Blackjack

Statistically, should we Hit or Stay?


Vs.


Vs.


Vs.


#### Logical Operators Examples

```
      int x = 12, y = 5, z = -4;

```

|(x > y) && (y > z)|Col2|
|---|---|
|`(x > y) && (z > y)`||
|`(x <= z) || (y == z)`||
|`(x <= z) || (y != z)`||
|`!(x >= z)`||


Let¡¯s Practice


_a = 3, b = 5, c = 7_

```
a > b || c != b

a + b > c && c  a < b

!(a < b) && c / a == b % a

```

#### Let¡¯s Practice

Write a program that asks the user
for a mass in kg and then calculates
the weight in Newtons.


(weight = mass * 9.81).


Display the weight in Newtons to the
user. If the weight is between 10 and
1000 Newtons, tell the user the
object is just right. If the weight is
more than 1000 Newtons, tell the
user that the object is too heavy. If
the weight is less than 10 Newtons,
tell the user that the object is too
light.


# Answer

###### The answer is available in our GitHub ch03-materials/examples folder: Newtons.java


#### Comparing String Objects


 In most cases, you cannot use the relational
operators to compare two `String` objects.


 Reference variables contain the address of the

object they represent.


 Unless the references point to the same object,
the relational operators will not return true.


#### Method `equals`

```
String name1 = "Malik",

name2 = "Malia";

// Compare "Malik" and "Malia"

if (name1.equals(name2))

System.out.println(name1 + " and " + name2 + " are the same.");

else

System.out.println(name1 + " and " + name2 + " are the NOT the same.");

```

#### Method `compareTo`

```
String name1 = "Malik",

name2 = "Malia";

// Compare "Malik" and "Malia"

if (name1.compareTo(name2) < 0)

System.out.println(name1 + " is before " + name2);

else if (name1.compareTo(name2) == 0)

System.out.println(name1 + " is equal to " + name2);

else if (name1.compareTo(name2) > 0)

System.out.println(name1 + " is after " + name2);

```

The output from this code:
**Malik is after Malia**


#### Ignoring Case in String Comparisons


 In the `String` class the `equals` and `compareTo`

methods are case sensitive.


 In order to compare two `String` objects that
might have different case, use:

```
  
```

or
`equalsIgnoreCase` _,_

```
  
  compareToIgnoreCase

```

```
    String input;   // To hold the user's input

Scanner kbd = new Scanner(System.in);

// Prompt the user to enter the secret word.

System.out.print("Password for Gryffindor Tower? ");

input = kbd.nextLine();

// Determine whether the Hogwarts student knows the password.

if (input.equalsIgnoreCase("Caput Draconis"))

System.out.println("You may enter!");

System.out.println("That is NOT the password!");

```

#### Traditional switch syntax

```
int input = kbd.nextInt();

switch (input)

{

 case 1: System.out.print("It's a 1!"); break;

 case 2: System.out.print("It's a 2!"); break;

 default: System.out.print("Nope");

}

```

### The case Statement




## Seasons.java


#### New(er) in Java  Switch Expressions

 Java introduced Switch Expressions in Java 14


 It¡¯s a way to streamline the traditional switch statement


 For single command expressions (case x: print y), use the -> notation

```
switch (input)

{

 case 1 -> System.out.print("It's a 1!");

 case 2 -> System.out.print("It's a 2!");

 default -> System.out.print("Nope");

}

```

#### Switch Expressions can return a value

 Another cool option: you can have a switch statement return a

value

```
int input = kbd.nextInt();

String answer = switch (input)

{

case 1 -> "It's a 1!";

case 2 -> "It's a 2!";

default -> "Nope";
}; //note the ;

System.out.print(answer);

```

#### Let¡¯s Practice

Rewrite this if/elseif statement as a switch
(your choice of which one to use)

```
int choice = kbd.nextInt();

if (choice == 1 || choice == 2)

System.out.print("low key tiny");

else if (choice == 4)

System.out.print("that¡¯s mid");

else

System.out.print("max rizz");

```

##### SeasonsSwitchExpression. java SeasonsSwitchReturn.java


#### The System.out.printf Method.

 You can use the `System.out.printf` method to

perform formatted console output.


 The general format of the method is:

```
System.out.printf( FormatString, ArgList );

```

#### The System.out.printf Method

```
 System.out.printf( FormatString, ArgList );

```









#### The System.out.printf Method

To format a whole number, use the `d` format specifier


(yes, that¡¯s weird. In ye olden times, `d` meant decimal (base 10 numbers))

```
int hours = 40;

System.out.printf("I worked %d hours.\n", hours);

```

#### The System.out.printf Method








#### The System.out.printf Method


   Another example:

```
int dogs = 2, cats = 4;

System.out.printf("We have %d dogs and %d cats.\n", dogs, cats);

```

#### The System.out.printf Method

To print to anything with a decimal value, use the
##### f format specifier

```
    double grossPay = 874.12;

    System.out.printf("Your pay is %f.\n", grossPay);

```

#### The System.out.printf Method








#### The System.out.printf Method

To print to two decimal places, put a . with the desired precision in front of the `f`

```
double grossPay = 874.12;

System.out.printf("Your pay is %.2f.\n", grossPay);

```

#### The System.out.printf Method

You can also print larger numbers with a comma

```
 double grossPay = 5874.127;

 System.out.printf("Your pay is %,.2f.\n", grossPay);

```



#### The System.out.printf Method

```
          s
```

To format a string, use the format specifier

```
String name = "Ringo";

System.out.printf("Your name is %s.\n", name);

```

#### The System.out.printf Method

Specifying a field (column) width:

```
 int number = 9;
 System.out.printf("The value is %6d\n", number);

```



#### The System.out.printf Method

Another example:

```
 double number = 9.76891;
 System.out.printf("The value is %6.2f\n", number);

```



#### printf Options

[https://www.slideshare.net/martyhall/java-8-programming-tutorial-lists-maps-generic-types-printf-and-more-java-utilities](https://www.slideshare.net/martyhall/java-8-programming-tutorial-lists-maps-generic-types-printf-and-more-java-utilities)


The `String.format`
Method


 The `String.format`
method works exactly like
the `System.out.printf`
method, except that it does
not display the formatted
string on the screen.


 Instead, it returns a
reference to the formatted
string.


 You can assign the reference
to a variable and then use it

later.


