import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class Blackjack {
    private static List<String> deck = new ArrayList<>();
    private static List<String> playerHand = new ArrayList<>();
    private static List<String> dealerHand = new ArrayList<>();
    private static int playerScore = 0;
    private static int dealerScore = 0;

    public static void main(String[] args) {
        initializeDeck();
        shuffleDeck();

        startGame();
    }

    private static void initializeDeck() {
        String[] ranks = {"2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"};
        String[] suits = {"Hearts", "Diamonds", "Clubs", "Spades"};

        for (String suit : suits) {
            for (String rank : ranks) {
                deck.add(rank + " of " + suit);
            }
        }
    }

    private static void shuffleDeck() {
        Collections.shuffle(deck);
    }

    private static void startGame() {
        playerHand.clear();
        dealerHand.clear();
        playerScore = 0;
        dealerScore = 0;

        // Deal initial cards
        dealCard(playerHand);
        dealCard(dealerHand);
        dealCard(playerHand);
        dealCard(dealerHand);

        displayGameState();

        if (isBlackjack(playerHand)) {
            endGame("Player got Blackjack! You win!");
        }
    }

    private static void dealCard(List<String> hand) {
        String card = deck.remove(0);
        hand.add(card);
        updateScore(hand);
    }

    private static void updateScore(List<String> hand) {
        int score = 0;
        int aceCount = 0;

        for (String card : hand) {
            String rank = card.split(" ")[0];
            switch (rank) {
                case "A":
                    score += 11;
                    aceCount++;
                    break;
                case "K":
                case "Q":
                case "J":
                    score += 10;
                    break;
                default:
                    score += Integer.parseInt(rank);
            }
        }

        // Adjust for Aces
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }

        if (hand == playerHand) {
            playerScore = score;
        } else {
            dealerScore = score;
        }
    }

    private static void displayGameState() {
        System.out.println("Player's hand: " + playerHand + " (Score: " + playerScore + ")");
        System.out.println("Dealer's hand: " + dealerHand.get(0) + " and [Hidden]");
    }

    private static boolean isBlackjack(List<String> hand) {
        return hand.size() == 2 && (playerScore == 21 || dealerScore == 21);
    }

    private static void endGame(String message) {
        displayGameState();
        System.out.println(message);
        System.exit(0);
    }
}
