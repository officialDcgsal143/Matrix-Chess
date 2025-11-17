document.addEventListener("DOMContentLoaded", function() {
    const chess = new Chess(); // chess.js engine

    const board = Chessboard('board', {
        draggable: true,
        position: 'start',
        onDrop: function(source, target) {
            // make the move
            const move = chess.move({ from: source, to: target, promotion: 'q' });
            if (move === null) return 'snapback'; // illegal move
        },
    });

    board.onSnapEnd = function() {
        board.position(chess.fen());
    };
});
