export interface Problem {
  id: number;           // NeetCode sl no (1-150)
  name: string;         // Problem name
  lcNumber: number;     // LeetCode problem number
  url: string;          // LeetCode URL
  topic: string;        // Category
  difficulty: "Easy" | "Medium" | "Hard";
  week: number;         // 1-30
}

export const PROBLEMS: Problem[] = [
  // ══════════════════════════════════════════════════════════════
  // WEEK 1 — Arrays & Hashing (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:1,   name:"Contains Duplicate",                         lcNumber:217,  url:"https://leetcode.com/problems/contains-duplicate/",                                    topic:"Arrays & Hashing",     difficulty:"Easy",   week:1  },
  { id:2,   name:"Valid Anagram",                              lcNumber:242,  url:"https://leetcode.com/problems/valid-anagram/",                                          topic:"Arrays & Hashing",     difficulty:"Easy",   week:1  },
  { id:3,   name:"Two Sum",                                    lcNumber:1,    url:"https://leetcode.com/problems/two-sum/",                                                topic:"Arrays & Hashing",     difficulty:"Easy",   week:1  },
  { id:4,   name:"Group Anagrams",                             lcNumber:49,   url:"https://leetcode.com/problems/group-anagrams/",                                         topic:"Arrays & Hashing",     difficulty:"Medium", week:1  },
  { id:5,   name:"Top K Frequent Elements",                    lcNumber:347,  url:"https://leetcode.com/problems/top-k-frequent-elements/",                                topic:"Arrays & Hashing",     difficulty:"Medium", week:1  },

  // ══════════════════════════════════════════════════════════════
  // WEEK 2 — Arrays & Hashing (Part 2)
  // ══════════════════════════════════════════════════════════════
  { id:6,   name:"Product of Array Except Self",               lcNumber:238,  url:"https://leetcode.com/problems/product-of-array-except-self/",                           topic:"Arrays & Hashing",     difficulty:"Medium", week:2  },
  { id:7,   name:"Valid Sudoku",                               lcNumber:36,   url:"https://leetcode.com/problems/valid-sudoku/",                                            topic:"Arrays & Hashing",     difficulty:"Medium", week:2  },
  { id:8,   name:"Encode and Decode Strings",                  lcNumber:271,  url:"https://neetcode.io/problems/string-encode-and-decode",                                  topic:"Arrays & Hashing",     difficulty:"Medium", week:2  },
  { id:9,   name:"Longest Consecutive Sequence",               lcNumber:128,  url:"https://leetcode.com/problems/longest-consecutive-sequence/",                            topic:"Arrays & Hashing",     difficulty:"Medium", week:2  },
  { id:10,  name:"Valid Palindrome",                           lcNumber:125,  url:"https://leetcode.com/problems/valid-palindrome/",                                        topic:"Two Pointers",          difficulty:"Easy",   week:2  },

  // ══════════════════════════════════════════════════════════════
  // WEEK 3 — Two Pointers + Sliding Window (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:11,  name:"Two Sum II - Input Array Is Sorted",         lcNumber:167,  url:"https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",                        topic:"Two Pointers",          difficulty:"Medium", week:3  },
  { id:12,  name:"3Sum",                                       lcNumber:15,   url:"https://leetcode.com/problems/3sum/",                                                    topic:"Two Pointers",          difficulty:"Medium", week:3  },
  { id:13,  name:"Container With Most Water",                  lcNumber:11,   url:"https://leetcode.com/problems/container-with-most-water/",                               topic:"Two Pointers",          difficulty:"Medium", week:3  },
  { id:14,  name:"Trapping Rain Water",                        lcNumber:42,   url:"https://leetcode.com/problems/trapping-rain-water/",                                     topic:"Two Pointers",          difficulty:"Hard",   week:3  },
  { id:15,  name:"Best Time to Buy and Sell Stock",            lcNumber:121,  url:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",                         topic:"Sliding Window",        difficulty:"Easy",   week:3  },

  // ══════════════════════════════════════════════════════════════
  // WEEK 4 — Sliding Window (Part 2) + Stack (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:16,  name:"Longest Substring Without Repeating",        lcNumber:3,    url:"https://leetcode.com/problems/longest-substring-without-repeating-characters/",          topic:"Sliding Window",        difficulty:"Medium", week:4  },
  { id:17,  name:"Longest Repeating Character Replacement",    lcNumber:424,  url:"https://leetcode.com/problems/longest-repeating-character-replacement/",                 topic:"Sliding Window",        difficulty:"Medium", week:4  },
  { id:18,  name:"Permutation in String",                      lcNumber:567,  url:"https://leetcode.com/problems/permutation-in-string/",                                   topic:"Sliding Window",        difficulty:"Medium", week:4  },
  { id:19,  name:"Minimum Window Substring",                   lcNumber:76,   url:"https://leetcode.com/problems/minimum-window-substring/",                                topic:"Sliding Window",        difficulty:"Hard",   week:4  },
  { id:20,  name:"Sliding Window Maximum",                     lcNumber:239,  url:"https://leetcode.com/problems/sliding-window-maximum/",                                  topic:"Sliding Window",        difficulty:"Hard",   week:4  },

  // ══════════════════════════════════════════════════════════════
  // WEEK 5 — Stack
  // ══════════════════════════════════════════════════════════════
  { id:21,  name:"Valid Parentheses",                          lcNumber:20,   url:"https://leetcode.com/problems/valid-parentheses/",                                       topic:"Stack",                 difficulty:"Easy",   week:5  },
  { id:22,  name:"Min Stack",                                  lcNumber:155,  url:"https://leetcode.com/problems/min-stack/",                                               topic:"Stack",                 difficulty:"Medium", week:5  },
  { id:23,  name:"Evaluate Reverse Polish Notation",           lcNumber:150,  url:"https://leetcode.com/problems/evaluate-reverse-polish-notation/",                        topic:"Stack",                 difficulty:"Medium", week:5  },
  { id:24,  name:"Generate Parentheses",                       lcNumber:22,   url:"https://leetcode.com/problems/generate-parentheses/",                                    topic:"Stack",                 difficulty:"Medium", week:5  },
  { id:25,  name:"Daily Temperatures",                         lcNumber:739,  url:"https://leetcode.com/problems/daily-temperatures/",                                      topic:"Stack",                 difficulty:"Medium", week:5  },

  // ══════════════════════════════════════════════════════════════
  // WEEK 6 — Stack (cont.) + Binary Search (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:26,  name:"Car Fleet",                                  lcNumber:853,  url:"https://leetcode.com/problems/car-fleet/",                                               topic:"Stack",                 difficulty:"Medium", week:6  },
  { id:27,  name:"Largest Rectangle in Histogram",             lcNumber:84,   url:"https://leetcode.com/problems/largest-rectangle-in-histogram/",                          topic:"Stack",                 difficulty:"Hard",   week:6  },
  { id:28,  name:"Binary Search",                              lcNumber:704,  url:"https://leetcode.com/problems/binary-search/",                                           topic:"Binary Search",         difficulty:"Easy",   week:6  },
  { id:29,  name:"Search a 2D Matrix",                         lcNumber:74,   url:"https://leetcode.com/problems/search-a-2d-matrix/",                                     topic:"Binary Search",         difficulty:"Medium", week:6  },
  { id:30,  name:"Koko Eating Bananas",                        lcNumber:875,  url:"https://leetcode.com/problems/koko-eating-bananas/",                                     topic:"Binary Search",         difficulty:"Medium", week:6  },

  // ══════════════════════════════════════════════════════════════
  // WEEK 7 — Binary Search (Part 2)
  // ══════════════════════════════════════════════════════════════
  { id:31,  name:"Find Minimum in Rotated Sorted Array",       lcNumber:153,  url:"https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",                    topic:"Binary Search",         difficulty:"Medium", week:7  },
  { id:32,  name:"Search in Rotated Sorted Array",             lcNumber:33,   url:"https://leetcode.com/problems/search-in-rotated-sorted-array/",                          topic:"Binary Search",         difficulty:"Medium", week:7  },
  { id:33,  name:"Time Based Key-Value Store",                 lcNumber:981,  url:"https://leetcode.com/problems/time-based-key-value-store/",                              topic:"Binary Search",         difficulty:"Medium", week:7  },
  { id:34,  name:"Median of Two Sorted Arrays",                lcNumber:4,    url:"https://leetcode.com/problems/median-of-two-sorted-arrays/",                             topic:"Binary Search",         difficulty:"Hard",   week:7  },
  { id:35,  name:"Reverse Linked List",                        lcNumber:206,  url:"https://leetcode.com/problems/reverse-linked-list/",                                     topic:"Linked List",           difficulty:"Easy",   week:7  },

  // ══════════════════════════════════════════════════════════════
  // WEEK 8 — Linked List (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:36,  name:"Merge Two Sorted Lists",                     lcNumber:21,   url:"https://leetcode.com/problems/merge-two-sorted-lists/",                                  topic:"Linked List",           difficulty:"Easy",   week:8  },
  { id:37,  name:"Reorder List",                               lcNumber:143,  url:"https://leetcode.com/problems/reorder-list/",                                            topic:"Linked List",           difficulty:"Medium", week:8  },
  { id:38,  name:"Remove Nth Node From End of List",           lcNumber:19,   url:"https://leetcode.com/problems/remove-nth-node-from-end-of-list/",                        topic:"Linked List",           difficulty:"Medium", week:8  },
  { id:39,  name:"Copy List with Random Pointer",              lcNumber:138,  url:"https://leetcode.com/problems/copy-list-with-random-pointer/",                           topic:"Linked List",           difficulty:"Medium", week:8  },
  { id:40,  name:"Add Two Numbers",                            lcNumber:2,    url:"https://leetcode.com/problems/add-two-numbers/",                                         topic:"Linked List",           difficulty:"Medium", week:8  },

  // ══════════════════════════════════════════════════════════════
  // WEEK 9 — Linked List (Part 2)
  // ══════════════════════════════════════════════════════════════
  { id:41,  name:"Linked List Cycle",                          lcNumber:141,  url:"https://leetcode.com/problems/linked-list-cycle/",                                       topic:"Linked List",           difficulty:"Easy",   week:9  },
  { id:42,  name:"Find the Duplicate Number",                  lcNumber:287,  url:"https://leetcode.com/problems/find-the-duplicate-number/",                               topic:"Linked List",           difficulty:"Medium", week:9  },
  { id:43,  name:"LRU Cache",                                  lcNumber:146,  url:"https://leetcode.com/problems/lru-cache/",                                               topic:"Linked List",           difficulty:"Medium", week:9  },
  { id:44,  name:"Merge K Sorted Lists",                       lcNumber:23,   url:"https://leetcode.com/problems/merge-k-sorted-lists/",                                    topic:"Linked List",           difficulty:"Hard",   week:9  },
  { id:45,  name:"Reverse Nodes in K-Group",                   lcNumber:25,   url:"https://leetcode.com/problems/reverse-nodes-in-k-group/",                                topic:"Linked List",           difficulty:"Hard",   week:9  },

  // ══════════════════════════════════════════════════════════════
  // WEEK 10 — Trees (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:46,  name:"Invert Binary Tree",                         lcNumber:226,  url:"https://leetcode.com/problems/invert-binary-tree/",                                      topic:"Trees",                 difficulty:"Easy",   week:10 },
  { id:47,  name:"Maximum Depth of Binary Tree",               lcNumber:104,  url:"https://leetcode.com/problems/maximum-depth-of-binary-tree/",                            topic:"Trees",                 difficulty:"Easy",   week:10 },
  { id:48,  name:"Diameter of Binary Tree",                    lcNumber:543,  url:"https://leetcode.com/problems/diameter-of-binary-tree/",                                 topic:"Trees",                 difficulty:"Easy",   week:10 },
  { id:49,  name:"Balanced Binary Tree",                       lcNumber:110,  url:"https://leetcode.com/problems/balanced-binary-tree/",                                    topic:"Trees",                 difficulty:"Easy",   week:10 },
  { id:50,  name:"Same Tree",                                  lcNumber:100,  url:"https://leetcode.com/problems/same-tree/",                                               topic:"Trees",                 difficulty:"Easy",   week:10 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 11 — Trees (Part 2)
  // ══════════════════════════════════════════════════════════════
  { id:51,  name:"Subtree of Another Tree",                    lcNumber:572,  url:"https://leetcode.com/problems/subtree-of-another-tree/",                                 topic:"Trees",                 difficulty:"Easy",   week:11 },
  { id:52,  name:"Lowest Common Ancestor of BST",              lcNumber:235,  url:"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",          topic:"Trees",                 difficulty:"Medium", week:11 },
  { id:53,  name:"Binary Tree Level Order Traversal",          lcNumber:102,  url:"https://leetcode.com/problems/binary-tree-level-order-traversal/",                       topic:"Trees",                 difficulty:"Medium", week:11 },
  { id:54,  name:"Binary Tree Right Side View",                lcNumber:199,  url:"https://leetcode.com/problems/binary-tree-right-side-view/",                             topic:"Trees",                 difficulty:"Medium", week:11 },
  { id:55,  name:"Count Good Nodes in Binary Tree",            lcNumber:1448, url:"https://leetcode.com/problems/count-good-nodes-in-binary-tree/",                         topic:"Trees",                 difficulty:"Medium", week:11 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 12 — Trees (Part 3)
  // ══════════════════════════════════════════════════════════════
  { id:56,  name:"Validate Binary Search Tree",                lcNumber:98,   url:"https://leetcode.com/problems/validate-binary-search-tree/",                             topic:"Trees",                 difficulty:"Medium", week:12 },
  { id:57,  name:"Kth Smallest Element in a BST",              lcNumber:230,  url:"https://leetcode.com/problems/kth-smallest-element-in-a-bst/",                           topic:"Trees",                 difficulty:"Medium", week:12 },
  { id:58,  name:"Construct BST from Preorder Traversal",      lcNumber:1008, url:"https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/",    topic:"Trees",                 difficulty:"Medium", week:12 },
  { id:59,  name:"Binary Tree Maximum Path Sum",               lcNumber:124,  url:"https://leetcode.com/problems/binary-tree-maximum-path-sum/",                            topic:"Trees",                 difficulty:"Hard",   week:12 },
  { id:60,  name:"Serialize and Deserialize Binary Tree",      lcNumber:297,  url:"https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",                   topic:"Trees",                 difficulty:"Hard",   week:12 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 13 — Heap / Priority Queue
  // ══════════════════════════════════════════════════════════════
  { id:61,  name:"Kth Largest Element in a Stream",            lcNumber:703,  url:"https://leetcode.com/problems/kth-largest-element-in-a-stream/",                         topic:"Heap / Priority Queue", difficulty:"Easy",   week:13 },
  { id:62,  name:"Last Stone Weight",                          lcNumber:1046, url:"https://leetcode.com/problems/last-stone-weight/",                                       topic:"Heap / Priority Queue", difficulty:"Easy",   week:13 },
  { id:63,  name:"K Closest Points to Origin",                 lcNumber:973,  url:"https://leetcode.com/problems/k-closest-points-to-origin/",                              topic:"Heap / Priority Queue", difficulty:"Medium", week:13 },
  { id:64,  name:"Kth Largest Element in an Array",            lcNumber:215,  url:"https://leetcode.com/problems/kth-largest-element-in-an-array/",                         topic:"Heap / Priority Queue", difficulty:"Medium", week:13 },
  { id:65,  name:"Task Scheduler",                             lcNumber:621,  url:"https://leetcode.com/problems/task-scheduler/",                                          topic:"Heap / Priority Queue", difficulty:"Medium", week:13 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 14 — Heap (cont.) + Backtracking (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:66,  name:"Design Twitter",                             lcNumber:355,  url:"https://leetcode.com/problems/design-twitter/",                                          topic:"Heap / Priority Queue", difficulty:"Medium", week:14 },
  { id:67,  name:"Find Median from Data Stream",               lcNumber:295,  url:"https://leetcode.com/problems/find-median-from-data-stream/",                            topic:"Heap / Priority Queue", difficulty:"Hard",   week:14 },
  { id:68,  name:"Subsets",                                    lcNumber:78,   url:"https://leetcode.com/problems/subsets/",                                                 topic:"Backtracking",          difficulty:"Medium", week:14 },
  { id:69,  name:"Combination Sum",                            lcNumber:39,   url:"https://leetcode.com/problems/combination-sum/",                                         topic:"Backtracking",          difficulty:"Medium", week:14 },
  { id:70,  name:"Combination Sum II",                         lcNumber:40,   url:"https://leetcode.com/problems/combination-sum-ii/",                                      topic:"Backtracking",          difficulty:"Medium", week:14 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 15 — Backtracking (Part 2)
  // ══════════════════════════════════════════════════════════════
  { id:71,  name:"Permutations",                               lcNumber:46,   url:"https://leetcode.com/problems/permutations/",                                            topic:"Backtracking",          difficulty:"Medium", week:15 },
  { id:72,  name:"Subsets II",                                 lcNumber:90,   url:"https://leetcode.com/problems/subsets-ii/",                                              topic:"Backtracking",          difficulty:"Medium", week:15 },
  { id:73,  name:"Word Search",                                lcNumber:79,   url:"https://leetcode.com/problems/word-search/",                                             topic:"Backtracking",          difficulty:"Medium", week:15 },
  { id:74,  name:"Palindrome Partitioning",                    lcNumber:131,  url:"https://leetcode.com/problems/palindrome-partitioning/",                                 topic:"Backtracking",          difficulty:"Medium", week:15 },
  { id:75,  name:"Letter Combinations of a Phone Number",      lcNumber:17,   url:"https://leetcode.com/problems/letter-combinations-of-a-phone-number/",                   topic:"Backtracking",          difficulty:"Medium", week:15 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 16 — Backtracking (Part 3) + Tries (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:76,  name:"N-Queens",                                   lcNumber:51,   url:"https://leetcode.com/problems/n-queens/",                                                topic:"Backtracking",          difficulty:"Hard",   week:16 },
  { id:77,  name:"Implement Trie (Prefix Tree)",               lcNumber:208,  url:"https://leetcode.com/problems/implement-trie-prefix-tree/",                              topic:"Tries",                 difficulty:"Medium", week:16 },
  { id:78,  name:"Design Add and Search Words Data Structure",  lcNumber:211,  url:"https://leetcode.com/problems/design-add-and-search-words-data-structure/",              topic:"Tries",                 difficulty:"Medium", week:16 },
  { id:79,  name:"Word Search II",                             lcNumber:212,  url:"https://leetcode.com/problems/word-search-ii/",                                          topic:"Tries",                 difficulty:"Hard",   week:16 },
  { id:80,  name:"Number of Islands",                          lcNumber:200,  url:"https://leetcode.com/problems/number-of-islands/",                                       topic:"Graphs",                difficulty:"Medium", week:16 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 17 — Graphs (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:81,  name:"Clone Graph",                                lcNumber:133,  url:"https://leetcode.com/problems/clone-graph/",                                             topic:"Graphs",                difficulty:"Medium", week:17 },
  { id:82,  name:"Max Area of Island",                         lcNumber:695,  url:"https://leetcode.com/problems/max-area-of-island/",                                      topic:"Graphs",                difficulty:"Medium", week:17 },
  { id:83,  name:"Pacific Atlantic Water Flow",                lcNumber:417,  url:"https://leetcode.com/problems/pacific-atlantic-water-flow/",                             topic:"Graphs",                difficulty:"Medium", week:17 },
  { id:84,  name:"Surrounded Regions",                         lcNumber:130,  url:"https://leetcode.com/problems/surrounded-regions/",                                      topic:"Graphs",                difficulty:"Medium", week:17 },
  { id:85,  name:"Rotting Oranges",                            lcNumber:994,  url:"https://leetcode.com/problems/rotting-oranges/",                                         topic:"Graphs",                difficulty:"Medium", week:17 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 18 — Graphs (Part 2)
  // ══════════════════════════════════════════════════════════════
  { id:86,  name:"Walls and Gates",                            lcNumber:286,  url:"https://neetcode.io/problems/islands-and-treasure",                                      topic:"Graphs",                difficulty:"Medium", week:18 },
  { id:87,  name:"Course Schedule",                            lcNumber:207,  url:"https://leetcode.com/problems/course-schedule/",                                         topic:"Graphs",                difficulty:"Medium", week:18 },
  { id:88,  name:"Course Schedule II",                         lcNumber:210,  url:"https://leetcode.com/problems/course-schedule-ii/",                                      topic:"Graphs",                difficulty:"Medium", week:18 },
  { id:89,  name:"Graph Valid Tree",                           lcNumber:261,  url:"https://neetcode.io/problems/valid-tree",                                                 topic:"Graphs",                difficulty:"Medium", week:18 },
  { id:90,  name:"Number of Connected Components",             lcNumber:323,  url:"https://neetcode.io/problems/count-connected-components",                                 topic:"Graphs",                difficulty:"Medium", week:18 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 19 — Graphs (Part 3) + Advanced Graphs
  // ══════════════════════════════════════════════════════════════
  { id:91,  name:"Redundant Connection",                       lcNumber:684,  url:"https://leetcode.com/problems/redundant-connection/",                                    topic:"Graphs",                difficulty:"Medium", week:19 },
  { id:92,  name:"Word Ladder",                                lcNumber:127,  url:"https://leetcode.com/problems/word-ladder/",                                             topic:"Graphs",                difficulty:"Hard",   week:19 },
  { id:93,  name:"Reconstruct Itinerary",                      lcNumber:332,  url:"https://leetcode.com/problems/reconstruct-itinerary/",                                   topic:"Advanced Graphs",       difficulty:"Hard",   week:19 },
  { id:94,  name:"Min Cost to Connect All Points",             lcNumber:1584, url:"https://leetcode.com/problems/min-cost-to-connect-all-points/",                          topic:"Advanced Graphs",       difficulty:"Medium", week:19 },
  { id:95,  name:"Network Delay Time",                         lcNumber:743,  url:"https://leetcode.com/problems/network-delay-time/",                                      topic:"Advanced Graphs",       difficulty:"Medium", week:19 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 20 — Advanced Graphs (cont.) + 1-D DP (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:96,  name:"Swim in Rising Water",                       lcNumber:778,  url:"https://leetcode.com/problems/swim-in-rising-water/",                                    topic:"Advanced Graphs",       difficulty:"Hard",   week:20 },
  { id:97,  name:"Alien Dictionary",                           lcNumber:269,  url:"https://neetcode.io/problems/foreign-dictionary",                                         topic:"Advanced Graphs",       difficulty:"Hard",   week:20 },
  { id:98,  name:"Cheapest Flights Within K Stops",            lcNumber:787,  url:"https://leetcode.com/problems/cheapest-flights-within-k-stops/",                         topic:"Advanced Graphs",       difficulty:"Medium", week:20 },
  { id:99,  name:"Climbing Stairs",                            lcNumber:70,   url:"https://leetcode.com/problems/climbing-stairs/",                                         topic:"1-D DP",                difficulty:"Easy",   week:20 },
  { id:100, name:"Min Cost Climbing Stairs",                   lcNumber:746,  url:"https://leetcode.com/problems/min-cost-climbing-stairs/",                                topic:"1-D DP",                difficulty:"Easy",   week:20 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 21 — 1-D DP (Part 2)
  // ══════════════════════════════════════════════════════════════
  { id:101, name:"House Robber",                               lcNumber:198,  url:"https://leetcode.com/problems/house-robber/",                                            topic:"1-D DP",                difficulty:"Medium", week:21 },
  { id:102, name:"House Robber II",                            lcNumber:213,  url:"https://leetcode.com/problems/house-robber-ii/",                                         topic:"1-D DP",                difficulty:"Medium", week:21 },
  { id:103, name:"Longest Palindromic Substring",              lcNumber:5,    url:"https://leetcode.com/problems/longest-palindromic-substring/",                           topic:"1-D DP",                difficulty:"Medium", week:21 },
  { id:104, name:"Palindromic Substrings",                     lcNumber:647,  url:"https://leetcode.com/problems/palindromic-substrings/",                                  topic:"1-D DP",                difficulty:"Medium", week:21 },
  { id:105, name:"Decode Ways",                                lcNumber:91,   url:"https://leetcode.com/problems/decode-ways/",                                             topic:"1-D DP",                difficulty:"Medium", week:21 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 22 — 1-D DP (Part 3)
  // ══════════════════════════════════════════════════════════════
  { id:106, name:"Coin Change",                                lcNumber:322,  url:"https://leetcode.com/problems/coin-change/",                                             topic:"1-D DP",                difficulty:"Medium", week:22 },
  { id:107, name:"Maximum Product Subarray",                   lcNumber:152,  url:"https://leetcode.com/problems/maximum-product-subarray/",                                topic:"1-D DP",                difficulty:"Medium", week:22 },
  { id:108, name:"Word Break",                                 lcNumber:139,  url:"https://leetcode.com/problems/word-break/",                                              topic:"1-D DP",                difficulty:"Medium", week:22 },
  { id:109, name:"Longest Increasing Subsequence",             lcNumber:300,  url:"https://leetcode.com/problems/longest-increasing-subsequence/",                          topic:"1-D DP",                difficulty:"Medium", week:22 },
  { id:110, name:"Partition Equal Subset Sum",                 lcNumber:416,  url:"https://leetcode.com/problems/partition-equal-subset-sum/",                              topic:"1-D DP",                difficulty:"Medium", week:22 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 23 — 2-D DP (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:111, name:"Unique Paths",                               lcNumber:62,   url:"https://leetcode.com/problems/unique-paths/",                                            topic:"2-D DP",                difficulty:"Medium", week:23 },
  { id:112, name:"Longest Common Subsequence",                 lcNumber:1143, url:"https://leetcode.com/problems/longest-common-subsequence/",                              topic:"2-D DP",                difficulty:"Medium", week:23 },
  { id:113, name:"Best Time to Buy/Sell Stock with Cooldown",  lcNumber:309,  url:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",           topic:"2-D DP",                difficulty:"Medium", week:23 },
  { id:114, name:"Coin Change II",                             lcNumber:518,  url:"https://leetcode.com/problems/coin-change-ii/",                                          topic:"2-D DP",                difficulty:"Medium", week:23 },
  { id:115, name:"Target Sum",                                 lcNumber:494,  url:"https://leetcode.com/problems/target-sum/",                                              topic:"2-D DP",                difficulty:"Medium", week:23 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 24 — 2-D DP (Part 2)
  // ══════════════════════════════════════════════════════════════
  { id:116, name:"Interleaving String",                        lcNumber:97,   url:"https://leetcode.com/problems/interleaving-string/",                                     topic:"2-D DP",                difficulty:"Medium", week:24 },
  { id:117, name:"Longest Increasing Path in a Matrix",        lcNumber:329,  url:"https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",                    topic:"2-D DP",                difficulty:"Hard",   week:24 },
  { id:118, name:"Distinct Subsequences",                      lcNumber:115,  url:"https://leetcode.com/problems/distinct-subsequences/",                                   topic:"2-D DP",                difficulty:"Hard",   week:24 },
  { id:119, name:"Edit Distance",                              lcNumber:72,   url:"https://leetcode.com/problems/edit-distance/",                                           topic:"2-D DP",                difficulty:"Medium", week:24 },
  { id:120, name:"Burst Balloons",                             lcNumber:312,  url:"https://leetcode.com/problems/burst-balloons/",                                          topic:"2-D DP",                difficulty:"Hard",   week:24 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 25 — 2-D DP (Part 3) + Greedy (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:121, name:"Regular Expression Matching",                lcNumber:10,   url:"https://leetcode.com/problems/regular-expression-matching/",                             topic:"2-D DP",                difficulty:"Hard",   week:25 },
  { id:122, name:"Maximum Subarray",                           lcNumber:53,   url:"https://leetcode.com/problems/maximum-subarray/",                                        topic:"Greedy",                difficulty:"Medium", week:25 },
  { id:123, name:"Jump Game",                                  lcNumber:55,   url:"https://leetcode.com/problems/jump-game/",                                               topic:"Greedy",                difficulty:"Medium", week:25 },
  { id:124, name:"Jump Game II",                               lcNumber:45,   url:"https://leetcode.com/problems/jump-game-ii/",                                            topic:"Greedy",                difficulty:"Medium", week:25 },
  { id:125, name:"Gas Station",                                lcNumber:134,  url:"https://leetcode.com/problems/gas-station/",                                             topic:"Greedy",                difficulty:"Medium", week:25 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 26 — Greedy (Part 2) + Intervals (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:126, name:"Hand of Straights",                          lcNumber:846,  url:"https://leetcode.com/problems/hand-of-straights/",                                       topic:"Greedy",                difficulty:"Medium", week:26 },
  { id:127, name:"Merge Triplets to Form Target Triplet",      lcNumber:1899, url:"https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",                   topic:"Greedy",                difficulty:"Medium", week:26 },
  { id:128, name:"Partition Labels",                           lcNumber:763,  url:"https://leetcode.com/problems/partition-labels/",                                        topic:"Greedy",                difficulty:"Medium", week:26 },
  { id:129, name:"Valid Parenthesis String",                   lcNumber:678,  url:"https://leetcode.com/problems/valid-parenthesis-string/",                                topic:"Greedy",                difficulty:"Medium", week:26 },
  { id:130, name:"Insert Interval",                            lcNumber:57,   url:"https://leetcode.com/problems/insert-interval/",                                         topic:"Intervals",             difficulty:"Medium", week:26 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 27 — Intervals (Part 2) + Math & Geometry (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:131, name:"Merge Intervals",                            lcNumber:56,   url:"https://leetcode.com/problems/merge-intervals/",                                         topic:"Intervals",             difficulty:"Medium", week:27 },
  { id:132, name:"Non-overlapping Intervals",                  lcNumber:435,  url:"https://leetcode.com/problems/non-overlapping-intervals/",                               topic:"Intervals",             difficulty:"Medium", week:27 },
  { id:133, name:"Meeting Rooms",                              lcNumber:252,  url:"https://neetcode.io/problems/meeting-schedule",                                           topic:"Intervals",             difficulty:"Easy",   week:27 },
  { id:134, name:"Meeting Rooms II",                           lcNumber:253,  url:"https://neetcode.io/problems/meeting-schedule-ii",                                        topic:"Intervals",             difficulty:"Medium", week:27 },
  { id:135, name:"Minimum Number of Arrows to Burst Balloons", lcNumber:452,  url:"https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",              topic:"Intervals",             difficulty:"Medium", week:27 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 28 — Math & Geometry (Part 2)
  // ══════════════════════════════════════════════════════════════
  { id:136, name:"Rotate Image",                               lcNumber:48,   url:"https://leetcode.com/problems/rotate-image/",                                            topic:"Math & Geometry",       difficulty:"Medium", week:28 },
  { id:137, name:"Spiral Matrix",                              lcNumber:54,   url:"https://leetcode.com/problems/spiral-matrix/",                                           topic:"Math & Geometry",       difficulty:"Medium", week:28 },
  { id:138, name:"Set Matrix Zeroes",                          lcNumber:73,   url:"https://leetcode.com/problems/set-matrix-zeroes/",                                       topic:"Math & Geometry",       difficulty:"Medium", week:28 },
  { id:139, name:"Happy Number",                               lcNumber:202,  url:"https://leetcode.com/problems/happy-number/",                                            topic:"Math & Geometry",       difficulty:"Easy",   week:28 },
  { id:140, name:"Plus One",                                   lcNumber:66,   url:"https://leetcode.com/problems/plus-one/",                                                topic:"Math & Geometry",       difficulty:"Easy",   week:28 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 29 — Math & Geometry (Part 3) + Bit Manipulation (Part 1)
  // ══════════════════════════════════════════════════════════════
  { id:141, name:"Pow(x, n)",                                  lcNumber:50,   url:"https://leetcode.com/problems/powx-n/",                                                  topic:"Math & Geometry",       difficulty:"Medium", week:29 },
  { id:142, name:"Multiply Strings",                           lcNumber:43,   url:"https://leetcode.com/problems/multiply-strings/",                                        topic:"Math & Geometry",       difficulty:"Medium", week:29 },
  { id:143, name:"Detect Squares",                             lcNumber:2013, url:"https://leetcode.com/problems/count-points-on-a-line/",                                  topic:"Math & Geometry",       difficulty:"Medium", week:29 },
  { id:144, name:"Single Number",                              lcNumber:136,  url:"https://leetcode.com/problems/single-number/",                                           topic:"Bit Manipulation",      difficulty:"Easy",   week:29 },
  { id:145, name:"Number of 1 Bits",                           lcNumber:191,  url:"https://leetcode.com/problems/number-of-1-bits/",                                        topic:"Bit Manipulation",      difficulty:"Easy",   week:29 },

  // ══════════════════════════════════════════════════════════════
  // WEEK 30 — Bit Manipulation (Part 2)
  // ══════════════════════════════════════════════════════════════
  { id:146, name:"Counting Bits",                              lcNumber:338,  url:"https://leetcode.com/problems/counting-bits/",                                           topic:"Bit Manipulation",      difficulty:"Easy",   week:30 },
  { id:147, name:"Reverse Bits",                               lcNumber:190,  url:"https://leetcode.com/problems/reverse-bits/",                                            topic:"Bit Manipulation",      difficulty:"Easy",   week:30 },
  { id:148, name:"Missing Number",                             lcNumber:268,  url:"https://leetcode.com/problems/missing-number/",                                          topic:"Bit Manipulation",      difficulty:"Easy",   week:30 },
  { id:149, name:"Sum of Two Integers",                        lcNumber:371,  url:"https://leetcode.com/problems/sum-of-two-integers/",                                     topic:"Bit Manipulation",      difficulty:"Medium", week:30 },
  { id:150, name:"Reverse Integer",                            lcNumber:7,    url:"https://leetcode.com/problems/reverse-integer/",                                         topic:"Bit Manipulation",      difficulty:"Medium", week:30 },
];

export const WEEKS = Array.from({ length: 30 }, (_, i) => i + 1);

export const WEEK_NAMES: Record<number, string> = {
  1:  "Week 1 — Arrays & Hashing I",
  2:  "Week 2 — Arrays & Hashing II",
  3:  "Week 3 — Two Pointers + Sliding Window I",
  4:  "Week 4 — Sliding Window II",
  5:  "Week 5 — Stack",
  6:  "Week 6 — Stack II + Binary Search I",
  7:  "Week 7 — Binary Search II + Linked List I",
  8:  "Week 8 — Linked List II",
  9:  "Week 9 — Linked List III",
  10: "Week 10 — Trees I",
  11: "Week 11 — Trees II",
  12: "Week 12 — Trees III",
  13: "Week 13 — Heap / Priority Queue",
  14: "Week 14 — Heap II + Backtracking I",
  15: "Week 15 — Backtracking II",
  16: "Week 16 — Backtracking III + Tries",
  17: "Week 17 — Graphs I",
  18: "Week 18 — Graphs II",
  19: "Week 19 — Graphs III + Advanced Graphs I",
  20: "Week 20 — Advanced Graphs II + 1-D DP I",
  21: "Week 21 — 1-D DP II",
  22: "Week 22 — 1-D DP III",
  23: "Week 23 — 2-D DP I",
  24: "Week 24 — 2-D DP II",
  25: "Week 25 — 2-D DP III + Greedy I",
  26: "Week 26 — Greedy II + Intervals I",
  27: "Week 27 — Intervals II + Math I",
  28: "Week 28 — Math & Geometry II",
  29: "Week 29 — Math III + Bit Manipulation I",
  30: "Week 30 — Bit Manipulation II",
};
