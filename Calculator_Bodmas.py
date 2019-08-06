#Marina Deletic

from math import pow


def tokenization(expr):
    ##assume all inputs are error free

    expr= list(expr)
    tok= list()

    operators= ["+", "-", "*", "/", "^","(",")"]
    numbs = ["1", '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']

    i = 0
    while i in range(len(expr)):
        if expr[i] in operators:
            tok.append(expr[i])
        elif expr[i] in numbs:
            flt =""
            while i in range(len(expr)) and expr[i] in numbs :
                flt+= expr[i]
                i+=1
            tok.append(float(flt))
            i-=1
        i+=1

    return tok



def has_precedence(op1, op2):
    prec=["^",("*","/"),("+","-")]
    indx_op1=[i for i, prec in enumerate(prec) if op1 in prec]
    indx_op2 = [i for i, prec in enumerate(prec) if op2 in prec]

    if indx_op1 < indx_op2:
        return True
    return False


def evaluate(a,op,b):
    if op == "^":
        return pow(a,b)
    elif op =="*":
        return a*b
    elif op == "/":
        return a/b
    elif op == "+":
        return a+b
    elif op == "-":
        return a-b
    else:
        return None


def condense(tokens,index):
    tokens[index - 1] = evaluate(tokens[index - 1], tokens[index], tokens[index + 1])
    del tokens[index:index + 2]
    return tokens


def precedence_cal(tokens):
    if '^' in tokens:
        return condense(tokens,tokens.index('^'))

    elif '*' in tokens and '/' in tokens:

        index_m = tokens.index('*')
        index_d = tokens.index('/')

        if index_m < index_d:
            return condense(tokens, index_m)
        else:
            return condense(tokens, index_d)

    elif '*' in tokens:
        return condense(tokens,tokens.index('*'))
    elif '/' in tokens:
        return condense(tokens,tokens.index('/'))

    elif '+' in tokens and '-' in tokens:
        index_a = tokens.index('+')
        index_s = tokens.index('-')
        if index_a < index_s:
            return condense(tokens, index_a)
        else:
            return condense(tokens, index_s)

    elif '+' in tokens:
        return condense(tokens, tokens.index('+'))
    elif '-' in tokens:
        return condense(tokens, tokens.index('-'))

    else:
        return None



def simple_evaluation(tokens):
    for i in range(len(tokens)//2):
        tokens= precedence_cal(tokens)
    return tokens


def bracket_index(tokens):
    open_ind = list()
    bracket_pairs = list()
    for i in range(len(tokens)):
        if tokens[i] == '(':
            open_ind.append(i)
        elif tokens[i] == ')':
            bracket_pairs.append((open_ind[-1], i))
            open_ind.pop(-1)
    return bracket_pairs


def complex_evaluation(tokens):

    for i in range(tokens.count('(')):
        bracket_pairs= bracket_index(tokens)
        openb=bracket_pairs[0][0]
        closeb= bracket_pairs[0][1]
        val = simple_evaluation(tokens[openb+1:closeb])[0]
        tokens[openb]= val
        del tokens[openb+1:closeb+1]

    if len(tokens)>1:
        simple_evaluation(tokens)

    return tokens


def evaluation(string):
    return complex_evaluation(tokenization(string))[0]


print(evaluation('(1+2)+(3-4)+(5+6)^3'))
print(evaluation('2^5^2'))






