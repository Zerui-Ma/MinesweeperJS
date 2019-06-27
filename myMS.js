class Cell {
    constructor(is_mine) {
        this.is_mine = is_mine;
        this.display = '.';
        if (is_mine) {
            this.real = '#';
        }
        else {
            this.real = 0;
        }
    }
}

class Board {
    constructor(width, height, mine_count) {
        this.board = [];
        this.width = width;
        this.height = height;
        this.x_max = width + 1;
        this.y_max = height + 1;
        this.mine_cnt = mine_count;
        this.safe_cnt = this.width * this.height - mine_count;
    }

    init_board() {
        for (var i = 0; i <= this.y_max; i++) {
            this.board.push([]);
            for (var j = 0; j <= this.x_max; j++) {
                var empty_cell = new Cell(false)
                this.board[i].push(empty_cell);
            }
        }
    };

    print_real_board() {
        for (var i = 1; i < this.y_max; i++) {
            var row = '';
            for (var j = 1; j < this.x_max; j++) {
                row += this.board[i][j].real + ' ';
            }
            console.log(row + '\n');
        }
    };

    print_display_board() {
        for (var i = 1; i < this.y_max; i++) {
            var row = '';
            for (var j = 1; j < this.x_max; j++) {
                row += this.board[i][j].display + ' ';
            }
            console.log(row + '\n');
        }
    };

    print_final_board() {
        for (var i = 1; i < this.y_max; i++) {
            var row = '';
            for (var j = 1; j < this.x_max; j++) {
                if (this.board[i][j].display == '.') {
                    row += this.board[i][j].real + ' ';
                } else if (this.board[i][j].display == 'F') {
                    if (this.board[i][j].is_mine) {
                        row += this.board[i][j].display + ' ';
                    } else {
                        row += 'X' + ' ';
                    }
                } else {
                    row += this.board[i][j].display + ' ';
                }
            }
            console.log(row + '\n');
        }
    }

    place_mine(x_init, y_init) {
        var num_cells = this.width * this.height;
        if (this.mine_cnt >= num_cells) {
            return 'Error: Too Many Mines';
        }

        var arr = new Array(num_cells);
        for (var i = 0; i < num_cells; i++) {
            arr[i] = i + 1;
        }

        arr.sort(function () {
            return 0.5 - Math.random();
        })

        var mine_cnt_remain = this.mine_cnt;
        for (var i = 0; i < arr.length; i++) {
            if (mine_cnt_remain == 0) {
                break;
            }
            var y_x = this.compute_y_x(arr[i]);
            var y = y_x[0];
            var x = y_x[1];
            if (x == x_init && y == y_init) {
                continue;
            }
            if (mine_cnt_remain > 0) {
                this.board[y][x] = new Cell(true);
                mine_cnt_remain--;
            }
        }
    }

    compute_y_x(index) {
        var y = Math.ceil(index / this.width);
        var x = index % this.width;
        if (x == 0) {
            x = this.width;
        }
        return [y, x];
    }

    update_real() {
        for (var i = 1; i < this.y_max; i++) {
            for (var j = 1; j < this.x_max; j++) {
                if (this.board[i][j].is_mine) {
                    // Up
                    if (!this.board[i - 1][j].is_mine) {
                        this.board[i - 1][j].real++;
                    }
                    // Down
                    if (!this.board[i + 1][j].is_mine) {
                        this.board[i + 1][j].real++;
                    }
                    // Left
                    if (!this.board[i][j - 1].is_mine) {
                        this.board[i][j - 1].real++;
                    }
                    // Right
                    if (!this.board[i][j + 1].is_mine) {
                        this.board[i][j + 1].real++;
                    }
                    // Upper-left
                    if (!this.board[i - 1][j - 1].is_mine) {
                        this.board[i - 1][j - 1].real++;
                    }
                    // Upper-right
                    if (!this.board[i - 1][j + 1].is_mine) {
                        this.board[i - 1][j + 1].real++;
                    }
                    // Bottom-left
                    if (!this.board[i + 1][j - 1].is_mine) {
                        this.board[i + 1][j - 1].real++;
                    }
                    // Bottom-right
                    if (!this.board[i + 1][j + 1].is_mine) {
                        this.board[i + 1][j + 1].real++;
                    }
                }
            }
        }
    }

    click(x, y) {
        if (x <= 0 || x >= this.x_max || y <= 0 || y >= this.y_max) {
            return null;
        }
        var cur_cell = this.board[y][x];
        if (cur_cell.display != '.') {
            return null;
        }
        if (cur_cell.is_mine) {
            cur_cell.display = '@';
            this.print_final_board();
        } else {
            cur_cell.display = cur_cell.real;
            this.safe_cnt--;
            // Click surrounding cells
            if (cur_cell.real == 0) {
                this.click(x - 1, y);
                this.click(x + 1, y);
                this.click(x, y - 1);
                this.click(x, y + 1);
                this.click(x - 1, y - 1);
                this.click(x + 1, y - 1);
                this.click(x + 1, y + 1);
                this.click(x - 1, y + 1);
            }
        }
        if (this.safe_cnt == 0) {
            console.log('Congrats!')
        }
    }

    flag(x, y) {
        if (x <= 0 || x >= this.x_max || y <= 0 || y >= this.y_max) {
            return null;
        }
        var cur_cell = this.board[y][x];
        if (cur_cell.display == '.') {
            cur_cell.display = 'F';
        } else if (cur_cell.display == 'F') {
            cur_cell.display = '.';
        }
    }

    probe(x, y) {
        if (x <= 0 || x >= this.x_max || y <= 0 || y >= this.y_max) {
            return null;
        }
        if (this.board[y][x].display == this.board[y][x].real) {
            // Count flags
            var flag_cnt = 0;
            var neighbors = [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]];
            for (var i = 0; i < 8; i++) {
                var x_new = neighbors[i][0];
                var y_new = neighbors[i][1];
                if (this.board[y_new][x_new].display == 'F') {
                    flag_cnt++
                }
            }
            if (flag_cnt == this.board[y][x].display) {
                for (i = 0; i < 8; i++) {
                    x_new = neighbors[i][0];
                    y_new = neighbors[i][1];
                    this.click(x_new, y_new)
                }
            }
        }
    }
}

board = new Board(8, 4, 8);
board.init_board();
board.place_mine(4, 2);
board.update_real();
board.print_real_board();
board.click(4,2);
board.print_display_board();
