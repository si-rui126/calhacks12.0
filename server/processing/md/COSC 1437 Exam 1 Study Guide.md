# _COSC 1437 Exam 1 Study Guide_ _Prof Clark_

_1._ _Read the topic list and highlight any topics you don¡¯t feel 90% capable of describing to me if I_


_ask you a direct question about the idea._

_2._ _Take your highlighted topics from the list and review the slides over that topic and/or read that_


_section in your book._

_3._ _After you¡¯ve done that for all highlighted topics, review your assignments, practice questions,_


_and the sample code I¡¯ve posted. Do you feel confident that you could code small sections of_

_those if asked? If not, bring up a new window and try to code it yourself._

_4._ _Reach out to me for office hours or through e-mail with any topic you need extra assistance_


_with._

_5._ _Sleep the night before!_

## _Topic List (the bulletpoints also have the book section number for where to find the topic)_ _Chapter 1:_


  - _(1.5) The JVM (Java Virtual Machine)_


`o` _It emulates a computer and runs Java byte code, which it interprets line by line_

`o` _Byte code is generated using a Java compiler (either javac command or one within an IDE)_

`o` _The JVM is what makes Java code portable  the exact same byte code can run on any computer_


_that has a JVM installed_

## _Chapter 2:_


  - _(2.2) Printing in Java (print, println)_


`o` _System.out.print() or System.out.println()_

`o` _println adds a \n to the end of the line, so no need to add it yourself_


  - _(2.4) Primitive data types_


`o` _8 types in Java: byte, short, int, long, float, double, char, boolean_

`o` _Sizes for each in bytes in order of above list: 1, 2, 4, 8, 4, 8, 2, *_


         - _* booleans technically_ _are 1 bit, but can¡¯t be addressed that way so the actual size of a_

_boolean can vary depending upon if the variable needs to be padded or not based upon_


_the container it is utilized in. This is a really technical idea, so you will never be asked the_

_size for a boolean variable_ 


- _(2.5) Arithmetic Operators (+, -, *, /, %)_


`o` _Know the order of precedence (*, /, % at same level. +, - at the same level after *, /, %_

`o` _Can use parentheses to override precedence (force the calculation of certain operands first)_


- _(2.7) Cast operators_


`o` _Put the data type you want to cast into inside of parentheses_

`o` _Example:_

```
     int num = 3;

     short smallVal = (short)num;

```

`o` _Java will issue a compiler error if you attempt to store a "higher" data type into a "lower" data_


_type without casting, as this would cause data loss. It will not do a demotion automatically._


- _(2.8) Constant creating using final_


`o` _Constants cannot be changed in the code after they are initialized with a value_

`o` _Examples:_

```
     final double TAX_RATE = 0.08;
     final int TIMER_START = 60;

```

- _(2.9) String class usage_


`o` _String is a class, so String variables hold an address to the String location, not the String itself_

`o` _Useful String methods:_


       - _charAt(index)_

       - _length()_

       - _toLowerCase()_

       - _toUpperCase()_

`o` _Remember that Strings are immutable, which means that they cannot be altered once they have_


_been created._


- _(2.11) Comments_


`o` _Documentation written for human consumption  ignored by the compiler_

`o` _Three types:_


       - _Single line comments: //_

       - _Multi-line (block) comments: /*  */_

       - _Javadoc (documentation) comments:  /**  */_


           - _Javadoc comments can be used to create an HTML documentation file with_

_Package, Class, and Method level documentation. Very helpful!_


- _(2.13) Reading keyboard input with Scanner_


`o` _import java.util.Scanner;_

`o` _Declare one like this:_

```
     Scanner kbd = new Scanner(System.in);

```

`o` _Read from the kbd object (or whatever you called yours) using some of these methods:_


       - _nextDouble()_

       - _nextInt()_

       - _nextLine()_


`o` _To read a character, read in using nextLine() and then use the charAt(0) method:_


char answer = kbd.nextLine().charAt(0);

`o` _Be careful when mixing nextLine() calls with others like nextInt() or nextDouble() as you could_


_have keyboard buffer issues. This is at the end of sections 2.13 if you want to review it, and I also_

_have ConsumeLine.java in the Example Programs in Canvas to help._


 - _(2.14) Dialog Boxes_


`o` _A graphical window that either displays a message or requests input._

`o` _Located in the JOptionPane class of the swing library. To use dialog boxes,_

```
      import javax.swing.JOptionPane;

```

`o` _Two types of dialog boxes:_


        - _Message Dialog (displays message and OK button)_

        - _Input Dialog (provides a textbox and OK/Cancel buttons)_

`o` _All input comes in as a String. To convert this to a numeric type, use the parse methods for the_


_particular type (i.e. Integer.parseInt() or Double.parseDouble() )_

## _Chapter 3:_


 - _(3.1) relational operators (<, >, <=, >=, ==, !=)_

`o` _the result of these operators will be a boolean value (true or false)_

 - _(3.1, 3.2, 3.4) if/else if/else statements_

`o` _`if`_ _statement tests a boolean (or an expression that evaluates to a boolean) and if that test_

_condition is true, the code inside the_ _`if`_ _statement executes_
`o` _`else`_ _statement goes with an if. In the_ _`if`_ _statement, the code inside the_ _`if`_ _executes if the test_

_condition true and the code inside the_ _`else`_ _executes if the test condition is false_
`o` _it is possible to have else if statements between an if and else. That allows for multiple_

_conditions to be tested within the same set of code_

 - _(3.3) nested if statements_

`o` _When an_ _`if`_ _statement is immediately inside of another_ _`if`_

 - _(3.5) logical operators_

`o` _&& (and)  used between two boolean expressions. The whole expression with the && only_

_evaluates to true if both boolean expressions are true_
`o` _|| (or)  used between two boolean expressions. The whole expression with the || evaluates to_

_true as long as either one of the two boolean expressions is true_
`o` _! (not)  used on one boolean expression. It turns the result to the opposite of the boolean_

_expression. If the expression is true, then !expression will be false_

`o` _Precedence_


        - _Listed in order of precedence: ! && ||_
`o` _be able to evaluate expressions with logical operators_
```
         4 < -4 && 3 != 3 || 6+1 <= 7

```

        - This evaluates to **true** . Remember your order of operations. Math first.
```
         4 < -4 && 3 != 3 || 7 <= 7
```

        - && first, then ||. **Be careful**, you might want to short circuit here. You can¡¯t short circuit
an entire line. Just the thing directly on the other side of the &&.
```
         F && F || T

```

        - && first `. F && F` ¡æ `F`

`F || T` ¡æ `T`

`o` _be able to determine if a number is within a range using logical operators_


       - _use && to see if a number is inside a range_

       - _use || to see if a number is outside a range_

- _(3.6) comparing Strings_

`o` _you cannot use the relational operators to compare Strings in Java_
`o` _to test if two Strings are equal to each other, use the equals() method:_
```
     str1.equals(str2)

```

       - _returns true if equal, false if not_
`o` _to compare two Strings to each other, use the compareTo() method:_
```
     str1.compareTo(str2)

```

       - _returns 0 if the Strings are equal_

       - _returns a negative number if str1 "comes first"_

       - _returns a positive number is str2 "comes first"_
`o` _There are versions of both methods to ignore case: equalsIgnoreCase() and_

_compareToIgnoreCase()_

- _(3.9) switch statements_

`o` _used in some cases to replace an if/else if construct_

`o` _structure_


       - _keyword_ _`switch`_

       - _`switch`_ _tests an integer expression, a character, or a String (that wasn¡¯t possible in_
_C++)_

       - _`case`_ _keyword determines the code to run if the_ _`case`_ _value matches the test_

_expression_

       - _`default`_ _keyword is like the trailing_ _`else`_ _in an if/else if construct. It is what runs if no_
_`case`_ _statements matched the test expression_

`o` _breaks_


       - _`break`_ _keyword is important. It gets us out of the_ _`switch`_ _once we¡¯ve completed the_

_correct_ _`case`_ _statement code._

       - _Sometimes we leave break statements out on purpose so that we can execute fall-_
_through logic. That is when we want to execute a particular set of code for multiple_

_cases._

`o` _NOTE: The above is the traditional switch statement. You will not be asked about the specifics of_

_the other switch statements I showed you (switch expressions or returning a value from a_
_switch). However, if you are asked to code a switch statement, you¡¯re welcome to use any of the_

_three._

- _(3.10) Formatted output_


`o` _printf() method allows for formatted output_

`o` _System.out.printf(FormatString, ArgumentList);_


       - _The FormatString is the string you want to print, and it will contain format specifiers_

_(placeholders in the string for the items you want to apply format to)_

       - _The ArgumentList is the list of variables that are being formatted in the FormatString._

_The list of variables will be formatted and placed into the output in the order they_

_appear in the ArgumentList_

`o` _Formatting Options:_


       - _%s is for String_

       - _%d is for Integers (this one is tricky to remember)_

       - _%f is for Floating Point (which is both floats and doubles)_

       - _%n is equivalent to \n_

`o` _Decimal Precision and Width_


        - _Example: %6.3f_


            - _The number before the decimal point is the total width to display the output for_

_that variable_


            - _The number after the decimal point is the precision to display. This will print_

_with three decimal places of precision (and it does round)_

`o` _Example usage_

```
       double price = 56.99;
       String item = "WR-01";
       System.out.printf("%8s product has a price of %7.2f",
```

`item, price` );

_This prints the "WR-01" string in a width of 8 and prints the value in the price variable in a width_
_of 7 with 2 decimal places of precision._

`o` _Chart from the slides with formatting options (don¡¯t worry about %t)_

## _Chapter 4:_


 - _(4.1) Increment and decrement operators (++, --)_


`o` _++ adds 1 to a variable_

`o` _-- subtracts 1 from a variable_
`o` _Prefix vs Postfix notation_

        - _Prefix: "add 1, and then use it"_

        - _Postfix: "Use it, and then add 1"_

 - _Loops_

`o` _Have three main control parts:_

        - _Initialization (where the control variable starts)_

        - _Test (how long do we stay in this loop?)_

        - _Update (how we move through the loop. Usually ++ or --)_
`o` _(4.2) While loop_


    - _Syntax_

    - _while loop is a Pretest loop (which means we test first before we execute the loop_
_contents)_
`o` _(4.3) Input Validation_

    - _Using a while loop to tell the user they have entered an incorrect value and then giving_
_them the chance to enter a different value within the loop. Remember, input validation is_
_a "yelling" loop._
`o` _(4.4) Do-while loop_

    - _Syntax_

    - _Purpose_

       - _We use a do-while loop when we want to execute a portion of code and then_
_decide when we are finished if we want to do it again_

    - _Posttest loop_

       - _Posttest loops do the loop contents first and then check the test condition after_
_the loop contents have been run_

    - _Be careful tracing these. The result usually goes one iteration further than you think it_

_should._

`o` _(4.5) Counters_

    - _A variable that controls how many times we execute a loop_
`o` _(4.5) For loop_

    - _Syntax_
_for (initialization; test; update)_


       - _Initialization  where do we start_

       - _Test  how long do we keep going_

       - _Update  how do we move through the loop (++, --, etc.)_

    - _Pretest loop_

    - _Purpose_

       - _For loops are counter based loops. We use for loops when we know how many_
_times we want a section of code to be run._

    - _Using variables as the test limits instead of specific values_

       - _We can ask the user how many times to do something and hold that in a_
_variable, and then use that to test. For example:_

```
         System.out.println("How many values do you have? ");

         number = kbd.nextInt();

         for (int count = 0; count < number; count++)

```

    - _Updates other than using ++ or -- (like i += 2, or j -= 5)_

    - _You_ _**must**_ _be able to tell how many times a loop runs_
`o` _(4.6) Keeping a running total_

    - _Using an accumulator_

       - _An accumulator is the variable that contains the final total_

       - _Make sure you always initialize your accumulators to 0!_

    - _When you see += inside of a loop, it¡¯s going to be calculating a running total_
`o` _(4.6) Sentinel Values_

    - _A value that is the "key" to get out of a loop_

       - _"Hey user, keep entering values. Enter ___ to quit: "; Whatever you decide to put_
_in those ____ is the sentinel value._

    - _When are they used?_


            - _When we want to let the user keep entering values without telling us ahead of_
_time how many times they need._

            - _Used almost exclusively with a while loop_

        - _What values can they be?_

            - _Anything that isn¡¯t a "good" value within the loop. For example, if we are asking_
_for soccer scores, a sentinel value of 100 would be fine because it¡¯s about_
_impossible to score 100 in a soccer game. If we are asking for basketball scores,_
_a sentinel value of 100 would be a very poor choice, because 100 is a valid_

_basketball score._

`o` _(4.9) Knowing which loop to use in a scenario_

        - _Use a while loop when you don¡¯t know how many times you need to execute the loop_

_contents_

        - _Use a do-while when you want to determine at the end if you need to re-do code (like_
_asking the user if they want to play a game again)_

        - _Use a for loop when you know exactly how many times the loop needs to run_
`o` _(4.8) Nested loops_

        - _How many times does a nested loop run_

            - _The product of the number of times the outer loop runs and the number of times_
_the inner loop runs_

        - _Using nested loops (i.e. pattern building)_

            - _**Be sure to practice this!**_ _There are many questions in the Chapter 4 practice_
_folder._

 - _(4.11) Generating random numbers (using Random)_


`o` _Need to declare a random number generator instance:_
```
      Random rnd = new Random();
```

`o` _nextInt( )  the command to generate a random number_

        - _rnd.nextInt(x) (where x is an integer) will give you a random number from 0 up to but not_
_including x_

            - _i.e. rnd.nextInt(4) gives values from [0,3]_

            - _rnd.nextInt(8) gives values from [0,7]_
`o` _Creating a Random instance automatically seeds the random number generator, so you do not_


_have to do this in Java_

`o` _generating random numbers within a range_

        - _rnd.nextInt(x) + shift is the formula. x is "how many choices" and shift is "where do they_

_start"_

        - _so rnd.nextInt(4) + 6 would be "4 random numbers that start at 6"¡¦ 6, 7, 8, 9_

        - _rnd.nextInt(5)  2 would be "5 random numbers that start at -2" ¡¦ -2,_

_-1, 0, 1, 2_

## _Chapter 5:_


 - _We use methods to break a program into manageable chunks_

 - _(5.1) Defining a method_

`o` _Parts of a method:_


        - _Header_


            - _Access specifier  for us right now, that will be public static_

            - _Return type_

            - _Name_

            - _Parameter list_

        - _Body_

 - _(5.1) Method header_


`o` _The first line of the method_

 - _(5.1) Return types_

`o` _The type of the answer returned from a method_
`o` _If no answer returned, the return type is_ _**void**_

 - _(5.1) Calling a method_

`o` _Flow of control within the program_

        - _Know that when you reach a method call within main, main pauses right there and calls_

_the method_

 - _Know the difference between a method header and a call_


`o` _Header:_


        - _public static void myMethod(int num)_

`o` _Call:_


        - _myMethod(7);_

 - _(5.2) Arguments vs Parameters_

`o` _An argument is the value in the calling method (like main)_
`o` _A parameter is the variable that catches the value within the method_

 - _(5.2) Sending data to a method_

`o` _Every pass in Java is Pass by Value_
`o` _Pass by Value sends a copy of the value_
`o` _When you send a reference variable, it sends a copy of the address of the variable_

        - _Notice that this referring to passing_ _**A**_ _reference. Java does not have passing_ _**BY**_
_reference._

 - _(5.4) Returning a value from a method_

`o` _When you call a method that returns a value, you must do something with that value. Put it in a_

_variable, print it, etc._
`o` _Returning boolean values_

        - _Remember to name boolean methods something that clearly sounds like a yes/no_
_answer. isValid, containsValue, etc._
`o` _Design: do not return out of the middle of a method_

 - _(5.1) Javadoc comments_


`o` _Using the @param tag and the @return tag_

## _Chapter 7:_


 - _(7.1) Be able to create an array of primitive types_


`o` _Know syntax_

`o` _Size declarator: the number of elements you¡¯re asking for._

```
    o int[] numbers = new int[10];

```

 - _(7.1) Accessing an element in an array_


`o` _Use the subscript (like this: numbers[8])_

`o` _Print an array element_

`o` _Assign a value to an array element (numbers[7] = 25;)_


 - _(7.1) Bounds Checking_


`o` _Java will not allow you to access an element out of the bounds of the array_

`o` _It throws an ArrayIndexOutOfBounds exception if the program tries to do so_


 - _(7.1) Using an initialization list to create an array_


`o` _Looks like this: int[] values = {2,4,6,8,10};_

`o` _The code does not need to provide a size declarator if an initialization list is used_


- _(7.2) Array length_


`o` _The .length field can be used on an array to tell how large the array is_


       - _.length is a field, not a method, so no ()_

`o` _Best practice is to use .length in array loop testing instead of a literal value_


       - _Example:_

_for (int j=0; j < numbers.length; j++)_


instead of

for (int j = 0; j < 10; j++)

- _(7.2) Copying arrays_


`o` _Setting two arrays equal to each other directly will only copy an address, not copy array contents_

`o` _Loop through the first array to copy its elements to the second array_


- _(7.3) Passing arrays to methods_


`o` _Passes the address, so the method is able to modify the original array_

`o` _Parameter data type is int[], double[], or whatever data type is required with empty brackets_


_after it. Do not put a number in the brackets._

```
     public static int someMethod(int[] arr)

```

- _(7.5) Returning an array from a method_


`o` _The return type will be int[], double[], or whatever data type of array is being returned with_


_empty brackets after it. Do not put a number in the brackets._

```
     public static double[] makeArray()

```

_this method would create an array in the method and then_ _**return**_ _it._


- _(7.2) Enhanced for loop_


`o` _Know the syntax_

`o` _Know how to convert a regular for loop to an enhanced for loop and be able to convert an_


_enhanced for loop into a regular for loop._

```
     int[] numbers = new int[50];

     for (int val : numbers)

     System.out.print(val + " ");

```

_Is equivalent to_

```
     for (int index = 0; index < numbers.length; index++)

       System.out.print(numbers[index] + " ");

```

_Both of these loops print out all the values inside of the numbers array_


- _(7.9) Two dimensional arrays_


`o` _Cells are accessed both by their row number and their column number_

`o` _Rows and columns both start at 0_

`o` _Know the syntax for declaring a two-dimensional array_

```
        double[][] prices = new double[5][2];

```

`o` _Be able to access all elements of a two-dimensional array (be able to print all values and also put_


_values into each cell of the array)_


       - _You¡¯ll need nested loops to do this._

```
         for (int row = 0; row < prices.length; row++)

         {

```

```
for (int col = 0; col < prices.length[row]; col++)

{

System.out.print(prices[row][col] + " ");

}

System.out.println(); //move the cursor to the next line

}

```

