# Marina Deletic
# 27842967
import copy


def new_board():

    blank_board = list([[0 for row in range(8)] for col in range(8)])
    refresh = [2, 1, 1, 2]
    i = 0
    for row in [3, 4]:
        for col in [3, 4]:
            blank_board[row][col] = refresh[i]
            i += 1
    return blank_board


def print_board(board):
    pboard = copy.deepcopy(board)
    pboard.append(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])
    i = 1
    for row in range(len(pboard)):
        print(i, ' {}  {}  {}  {}  {}  {}  {}  {}'.format(*pboard[row]))
        i += 1


def score(board):
    s1 = 0
    s2 = 0
    for row in range(len(board)):
        for col in range(len(board[0])):
            if board[row][col] == 1:
                s1 += 1
            elif board[row][col] == 2:
                s2 += 1
    return s1, s2


def print_score(score):
    print('\nScores: \nPlayer 1: %s   Player 2: %s' % score)
    if score[0]>score[1]:
        print('Player 1 wins!')
    elif score[0] < score[1]:
        print('Player 2 wins!')
    else:
        print('Draw')


def isonboard(pos):
    # Returns True if the coordinates are located on the board.
    return 0 <= pos[0] <= 7 and 0 <= pos[1] <= 7


def otherplayer(player):
    if player == 1:
        otherP = 2
    elif player == 2:
        otherP = 1
    else:
        print('Player does not exist')
        return False
    return otherP


def enclosing(board, player, pos, direct):

    if not isonboard(pos):
        return False

    rdir, cdir = direct[0], direct[1]
    r, c = pos[0]+rdir, pos[1]+cdir   # first step in direction
    otherP = otherplayer(player)

    if isonboard((r, c)) and board[r][c] == player:
        # check if the next step is on the board and that it is not the players stone
        return False

    while isonboard((r, c)) and board[r][c] == otherP:  # there is the other players piece at that place
        r, c = r + rdir, c + cdir

    if isonboard((r, c)) and board[r][c] == player:
        return True
    else:
        return False


def valid_moves(board, player):

    validpos = []
    for row in range(len(board)):
        for col in range(len(board[0])):
            for rdir, cdir in [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]:
                pos = (row, col)
                if enclosing(board, player, pos, (rdir, cdir)) and board[row][col] == 0:
                    if pos not in validpos:
                        validpos.append(pos)
    return validpos


def next_state(board, player, pos):

    valipos = valid_moves(board, player)
    next_board = copy.deepcopy(board)
    otherP = otherplayer(player)

    if pos in valipos:
        next_board[pos[0]][pos[1]] = player # place player tile in position

        for rdir, cdir in [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]:
            # iterate through all directions
            r, c = pos[0] + rdir, pos[1] + cdir
            while isonboard((r, c)) and board[r][c] == otherP and enclosing(board,player,pos,(rdir,cdir)):
                # there is the other players piece at that place and is enclosed by another stone of current player
                next_board[r][c] = player
                r, c = r + rdir, c + cdir
    else:
        print('Not a valid move ')
        return

    return next_board, next_player(next_board, player)


def next_player(board, player):
    otherP = otherplayer(player)

    if valid_moves(board, otherP) != []:
        next_plyr = otherP
    elif valid_moves(board, otherP) == [] and valid_moves(board, player) != []:
        next_plyr = player
    elif valid_moves(board, player) == [] and valid_moves(board, otherP) == []:
        next_plyr = 0
    else:
        return
    return next_plyr


def position(string):
    string = string.lower()
    colLet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    rowNo = [1, 2, 3, 4, 5, 6, 7, 8]

    if len(string) == 2 and string[0] in colLet and int(string[1]) in rowNo:
        pos = (int(string[1]) - 1, ord(string[0])-97)
        return pos
    else:
        return


def valid_pos_readable(valid_moves):
    pos_readable = []
    for i in range(len(valid_moves)):
        pos = [chr(valid_moves[i][1]+97), valid_moves[i][0]+1]
        pos_readable.append(''.join(map(str, pos)))
    return pos_readable


def optimise_move(board, valmove):

    score_move = 0
    move = None

    for i in range(len(valmove)):
        board_copy = copy.deepcopy(board)
        b1 = next_state(board_copy, 2, (valmove[i][0], valmove[i][1]))[0]

        if score(b1)[1] >= score_move:
            score_move = score(b1)[1]
            move = valmove[i]
    move_readable = valid_pos_readable([move])[0]
    return move_readable


def move_input():
    return input('Input a position to drop your stone (in the format "d4") \n or quit by inputting q: ')


def print_valmov(valmov):
    read_vm = valid_pos_readable(valmov)
    print('Valid moves: ', ('{}  '*len(read_vm)).format(*read_vm))


def run_two_players():
    # initialise
    board = new_board()
    print_board(board)
    player = 1
    valmov = valid_moves(board, player)

    print('\nPlayer', player, 'starts')
    print_valmov(valmov)

    move = move_input()

    while move != 'q' and player != 0:

        while position(move) is None or position(move) not in valmov:
            # check for invalid moves - repeat until valid move is entered
            print('\nNot a valid move')
            move = move_input()

        pos = position(move)
        board, player = next_state(board, player, pos)
        print_board(board)

        if player == 0:
            print('\nEnd of Game!')
            break

        valmov = valid_moves(board, player)

        print('\nYour turn Player ', player)
        print_valmov(valmov)
        move = move_input()
    print_score(score(board))


def run_one_player():
    # initialise
    board = new_board()
    print_board(board)
    player = 1
    valmov = valid_moves(board, player)

    print('\nPlayer', player, 'starts')
    print_valmov(valmov)
    move = move_input()

    while move != 'q' and player != 0:

        while position(move) is None or position(move) not in valmov:
            # check for invalid moves - repeat until valid move is entered
            print('\nNot a valid move')
            move = move_input()

        pos = position(move)
        board, player = next_state(board, player, pos)
        print_board(board)

        if player == 0:
            print('\nEnd of Game!')
            break
        elif player == 2:
            valmov = valid_moves(board, player)
            move = optimise_move(board, valmov)
            print('\nPlayer 2 played:', move)

        else:
            valmov = valid_moves(board, player)
            print('\nYour turn Player ', player)
            print_valmov(valmov)
            move = move_input()
    print_score(score(board))

run_two_players()
#run_one_player()

# fastest winning play - ['f5','d6','c5','f4','e3','f6','g5','e6','e7]

