---
title: Compiling Regex in Haskell, Part 1
subtitle: Building and Testing a Regex Interpreter
date: 2020-10-27
status: post
---

This post is a first in a larger series where I rebuild an
[ed](https://en.wikipedia.org/wiki/Ed_(text_editor)) clone in Haskell. My goal is
to use this implementation as a basic platform to test out some new algorithms
I've been researching to do text processing, the first of which will be related
to regex. I hope you stay tuned!

The full source for this post and the next posts in the series is available
[here](https://github.com/matthewmazzanti/haskell-regex).


## The Approach

While a regex complier is fairly straightforward in the world of compilers, we
will be taking a very measured and holistic approach to ensure correctness at
every point in the process. We will start with building and testing a regex
*interpreter* rather than a *compiler* to act as a baseline for the rest of the
transformations we build. That way, as we apply more advanced algorithms and
optimizations, we can be sure that their implementation is correct by comparing
it to the baseline that we establish here.


## Regex AST

Lets start with a basic regex AST implementation:

```hs
data Regex
    = Empty
    | Lit Char
    | And Regex Regex
    | Or Regex Regex
    | Mark Regex
    | Plus Regex
    | Star Regex
    deriving Show
```

An interesting note about this data type is that any construction with it is a
valid regex. Perhaps not a sane regex, but a valid one nonetheless. This is in
line with the standard Haskell practice of making *illegal types
unrepresentable* - there's no way to get an invalid regex here, simplifying the
testing code we will write later.

Lets take a look at some example regex would look like in this data type:

```hs
-- /abc/
And (Lit 'a') (And (Lit 'b) (Lit 'c'))

-- /a|b/
Or (Lit 'a') (Lit 'b')

-- /a*|b+/
Or (Star (Lit 'a')) (Plus (Lit 'b'))
```

While its a little verbose, its clear that any standard regex you can write can
be represented in this framework, which is a good starting point. We will be
foregoing writing a parsing frontend for this AST for the time being since I am
primarily interested in providing a regex implementation as a first pass here.


## Simple AST Interpretation

With this data-type in hand, the next order of business is to build a reference
matcher implementation:

```hs
match :: Regex -> String -> Bool
match re syms = isJust $ find (== "") $ matchStream re syms

matchStream :: Regex -> String -> [String]
matchStream (Empty) syms        = [syms]
matchStream (Lit _) []          = []
matchStream (Lit c) (sym:syms)  = if c == sym then [syms] else []
matchStream (And re re')   syms = matchStream re syms >>= matchStream re'
matchStream (Or re re')    syms = matchStream re syms <> matchStream re' syms
matchStream (Mark re)      syms = matchStream re syms <> [syms]
matchStream (Plus re)      syms = matchStream re syms >>= matchStream (Star re)
matchStream star@(Star re) syms = (<> [syms]) $ do
    syms' <- matchStream re syms
    if syms' /= syms
       then matchStream star syms'
       else []
```

Theres a lot going on here, so lets break this down and take a closer look at
each of the component parts.

### The `match` function

```hs
match :: Regex -> String -> Bool
match re syms = isJust $ find (== "") $ matchStream re syms
```

The primary match function returns whether or not a given regex and string
actually produce a full match. The bulk of the work is done in the `matchStream`
function, which produces a list of possible remainder strings after the regex
has done the work of parsing. With that input, all we need to do is scan the
resulting strings and return `True` if we find an empty one, indicating a match.
`hs|>isJust $ find (== "")` does this, searching through this list to find the
first instance of an empty string, indicating that the regex has parsed and
accepted the entire input.

This is also an instance of taking advantage of Haskell's lazy evaluation. In
strict languages, the `matchStream` would have to eagerly calculate all possible
parses of the string with the regex, and return a massive list to be searched
through. Therefore, this function would more likely be written as a loop that
evaluates different options and returns whether a full match is found. However,
with lazy evaluation, this list is calculated on-the-fly as we try to find the
empty string. This allows us to have a nice separation of concerns in our
implementation, one function to parse strings and recurse, and another to
analyze that input for values we care about. All together this leads to a
cleaner, more declarative, implementation without the performance overhead this
would lead to in strict languages.

### Simple Cases

```hs
matchStream (Empty)   syms       = [syms]
matchStream (Lit _)   []         = []
matchStream (Lit c)   (sym:syms) = if c == sym then [syms] else []
matchStream (Mark re) syms       = matchStream re syms <> [syms]
matchStream (Or re re') syms     = matchStream re syms <> matchStream re' syms
```

If you're not familiar, `<>` is just list concatenation, and is a more generic
version of `++`, E.G.:

```ghci
λ= [1,2,3] ++ [4,5,6]
[1,2,3,4,5,6]

λ= [1,2,3] <> [4,5,6]
[1,2,3,4,5,6]
```

As previously noted, `matchStream` takes the regex and the input string and
returns a list of possible parses of the string. The basic cases here are fairly
straightforward: 
- `Empty` simply returns a singleton list of the input string.
- `Lit` requires that the string be non-empty, and if so, advances the input one
  character. In all other cases it fails and terminates this branch of the
  parse.
- `Mark` provides two choices: either the result of matching the expression, or
  the original stream if we skip the regex.
- `Or` just combines the lists produced by the first regex with those of the
  second, with the same starting strings as the input.


### `And` Operator

```hs
matchStream (And re re') syms = matchStream re syms >>= matchStream re'
```

In the case of the `And` regex we take advantage of the `>>=` (pronounced
"bind") function defined for Lists. This function has type
```hs
(>>=) :: [a] -> (a -> [b]) -> [b]
```
It takes a list, and a function to produce a list for each value in the list
values, and produces a single new list of all options. This allows us to
describe compounding actions that may produce multiple results, or none at all,
in a very succinct way. In practice (note: `ghci|>λ= ` is my prompt for ghci,
the Haskell interpreter/repl):

```ghci
λ= let rep = \i -> [0..i]

λ= rep 0
[]

λ= rep 2
[1,2]

λ= rep 4
[1,2,3,4]

λ= [0..3] >>= rep
[1,1,2,1,2,3]

λ= [0..3] >>= rep >>= rep
[1,1,1,2,1,1,2,1,2,3]
```

We start with a simple function `rep` which, for each value in the list,
produces a new list of 1 to `i`. By binding `rep` together multiple times, we
produce a single list which is a combination of all of these choices.  We can
also terminate a path, as in the case of 0, by returning an empty list.
Repeating this process again tends to have a multiplicative effect, with each
list exponentially longer than the last as the possible choices build up.

In the case of `matchStream`, this behavior is exactly what we want: All
possible parses of the first sub-regex should be fed to all parses of the second
sub-regex, resulting in a list of all possible parses for the combined
operators. Once again, by example:

```ghci
-- /a?/
λ= let mark = Mark (Lit 'a')

λ= matchStream mark "a"
["","a"]

-- /a?a?/
λ= matchStream (And mark mark) "aa"
["","a","a","aa"]

λ= matchStream (And mark mark) "a"
["","","a"]
```

The most interesting case here is where `And mark mark` is matched against `"a"`
producing three choices: 
- The first `Mark` matching and the second `Mark` getting skipped.
- The first `Mark` getting skipped and the second `Mark` matching.
- Both `Marks` getting skipped.
- Both `Marks` matching. This choice gets culled, as it causes the second
  literal to fail and produce `[]`.

### The `Star` Operator
```hs
matchStream star@(Star re) syms = (<> [syms]) $ do
    syms' <- matchStream re syms
    if syms' /= syms
       then matchStream star syms'
       else []
```

The `Star` operator is the most complex of the lot, and the only one to take
advantage of `do` notation. Lets break it down further.

We start with `hs|>(<> [syms])`. This leverages
[infix](https://wiki.haskell.org/Infix_operator) and
[curried](https://wiki.haskell.org/Currying) functions at the same time. It
describes appending the unadvanced string to the rest of the strings produced by
the `Star` operator.

Next is the do notation which is a bit trickier. We bind the result of matching
the string to a new variable `syms'`, and check that `syms'` is distinct from
the original `syms` variable. This is needed as otherwise if the `re` operator
matched no symbols, then we land in an infinite loop of matching no symbols as
we recurse. If our `syms'` variable is different we recurse, otherwise
terminating.

An example:

```ghci
λ= matchStream (Star (Lit 'a')) "aaa"
["","a","aa","aaa"]
```

From this example you can see the resulting parses, in priority order. The first
case is a full match- the entire input stream is consumed. From there, we
backtrack adding another `'a'` char back into the stream so that other operators
can match if needed.

### The `Plus` Operator
```hs
matchStream (Plus re) syms = matchStream re syms >>= matchStream (Star re)
```

The `Plus` operator leans on the `Star` operator, since they are nearly the
same, but imposes that the regex match at least once before repeating the match
in the same manner as the `And` operator.


## Testing the implementation

So far we've defined a simple interpreter, but done nothing to ensure that it
works! Lets lay down some basic sanity tests:

```ghci
λ= match (Lit 'a') "a"
True

λ= match (Lit 'a') "aa"
False

λ= match (And (Lit 'a') (Lit 'b')) "ab" 
True

λ= match (Or (Lit 'a') (Lit 'b')) "a"
True

λ= match (Or (Lit 'a') (Lit 'b')) "b"
True

λ= match (Star (Lit 'a')) "aaa" 
True

λ= match (Plus (Lit 'a')) ""
False

λ= match (Plus (Lit 'a')) "aaa"
True
```

Having to think up test cases for every relevant combination of regex and string
and test them one at a time gets old pretty quickly, at least for me. Luckily,
as previously mentioned, any data that can be represented by the `Regex` type is
a valid regex, perhaps we can use that to remove some of the repetitiveness
here?

### QuickCheck Property Testing

Enter QuickCheck, a library to automate the testing of code through random test
case generation. It provides facilities for generating random data that can be
fed into your implementation, and then checks that properties that you define
for that implementation always hold. If they do not, QuickCheck gives you a
counter example to debug. When your input data is complex and you need lots of
test cases to ensure everything works, QuickCheck is significantly easier to use
than specifying test cases and their results one at a time.

The first thing we have to do is define an `Arbitrary` instance for our regex
data type so that we can generate random regex to test against. This can be
automated with Haskell's generic data types, however I've elected to do this
manually to get a better feel for the internal workings:

```hs
instance Arbitrary Regex where
  arbitrary = sized (genRegex 1)
    where
      genRegex depth size = frequency
          [ (depth, Lit <$> arbitraryASCIIChar)
          , (depth, pure Empty)
          , (size,  genTwo And)
          , (size,  genTwo Or)
          , (size,  genOne Mark)
          , (size,  genOne Star)
          , (size,  genOne Plus)
          ]
        where genRegex' = genRegex (depth * 2) size
              genOne fn = fn <$> genRegex'
              genTwo fn = fn <$> genRegex' <*> genRegex'
```

Once again, theres a lot going on here so lets break it down.

### Size and Frequency

The first thing to note is the `size` parameter of `genRegex` and `sized`
function used to call `genRegex` at the top level. We use the size parameter to
roughly tune the final size of the regex, so that in general as the size param
goes up, the average size of the regex increases. QuickCheck increases the
`size` parameter as it tests more cases, so that it can start with simple cases
and move on to more complex ones.

This size parameter is used in the `frequency` function to bias the generation
of our data. To explain further, lets start with the simpler `oneof` function.
Using `oneof` we can build a simple boolean generator as follows:

```ghci
λ= let boolGen = oneof [pure True, pure False]

λ= generate $ sized 10 $ listOf boolGen
[True,False,True,False,False,True,False,False,True,True]
```

Each time `generate` is called on this generator it chooses, with equal
probability, an item in the list and returns it. Useful, but often you need more
control, which is where the  `frequency` function comes in. `frequency` allows
us to bias the generator to produce certain values more often. For example, if
we want to produce `True` with a 75% chance and `False` with a 25% chance we
define it as follows:

```ghci
λ= let boolGen = frequency [(3, pure True), (1, pure False)]

λ= generate $ sized 10 $ listOf boolGen
[True,True,True,True,True,True,True,True,True,False]
```

As you can see, we are now generating `True` much more often than `False` unlike
our example with `oneof`.

In our regex generator, we use the `frequency` function to tune how large the
resulting structure will be by biasing the generator based on the `size` and
`depth` parameters. `size` is set by QuickCheck, up to 30.  `depth` is our own
parameter, starting at 1 and doubling each time we recurse further into the
regex we are generating. We tie the `depth` parameter to the terminating values
`Empty` and `Lit` so that as our generator recurses further there is a greater
and greater chance that generation will stop. We pass `size` into the rest of
the parameters, giving us a baseline probability for continuing generation and
allowing us to make larger structures. As `size` grows, it becomes more likely
that the generated regex will recurse deeper to the point where `depth` gets big
enough to overcome it.

Lets see this in action:

```ghci
λ= generate (resize 1 $ arbitrary :: Gen Regex)
Plus (Star Empty)

λ= generate (resize 1 $ arbitrary :: Gen Regex)
Mark (Lit '0')

λ= generate (resize 10 $ arbitrary :: Gen Regex)
Mark (Plus (Mark (Star (Plus Empty))))

λ= generate (resize 10 $ arbitrary :: Gen Regex)
Or
  (And
    (Plus Empty)
    (Plus (And
      (Mark (And Empty Empty))
      (And (Lit ':') (Or Empty (Mark (Lit '8'))))
    ))
  )
  (Star (Or
    (Mark (Plus Empty))
    (Mark (Or (Plus (Mark (Mark Empty))) Empty))
  ))
```

As you can see from these examples, small size values tend to build small
structures, whereas larger size values tend to build larger values. Exactly what
we need to build a good `arbitrary`!

### Generating Random Strings

Everything we've done thus far is interesting, however we're still missing the
critical piece to testing the `match` implementation: a `String` to match
against! Naïvely, we could just use the `Arbitrary` instance on `String`
provided by QuickCheck to generate a random string of random length, however
this poses a couple of problems:
- We won't know if a randomly generated string *should* match, so we can't
  decide whether the return value of `match` is valid or not.
- The arbitrary instance for `String` will generate strings that are too random.
  The vast majority of these strings will have nothing to do with our regex, and
  will not match. This means churning through a lot of data to find cases that
  do match, increasing the length of our testing process.

We need to be able to generate random strings that *should always* match the
given regex, in order to test that our implementation hasn't missed anything.
Thankfully computer science has already thought of this: grammars, the class of
mathematical objects that regex are a part of, can be used to both match strings
as well as generate them.

What we need to do is to build a function of type
```hs
genString :: Regex -> Gen String
```

This would allow us to build a generator that only creates valid strings of a
given `Regex`, nicely solving the problems described above. My implementation
looks like this:

```hs
genString :: Regex -> Gen String
genString (Empty)        = pure []
genString (Lit c)        = pure [c]
genString (And re re')   = (<>) <$> genString re <*> genString re'
genString (Or re re')    = oneof [genString re, genString re']
genString (Mark re)      = oneof [pure [], genString re]
genString (Plus re)      = (<>) <$> genString re <*> genString (Star re)
genString star@(Star re) = oneof
    [ pure []
    , (<>) <$> genString re <*> genString star
    ]
```

This function is effectively the inverse of the `match` function, generating
values that should always match the given regex fragment and recursing to
generate more of the string from more of the regex. Lets see it in action:

```ghci
λ= generate $ listOf $ genString (Star (Or (Lit 'a') (Lit 'b')))
["bb","aa","","bbb","a","","aab","b","a","","b","","a","a",""]

λ= generate $ listOf $ genString (Plus (And (Lit 'a') (Mark (Lit 'b'))))
["ab","ab","abaababa","abaa","ab","aba","ab","aababa"]
```

### Bringing it all Together

With the ability go generate arbitrary regex and valid strings from those regex,
we can now build the core test function:

```hs
test :: Regex -> Property
test re = forAll (genString re) (match re)
```

Here we take advantage of the `forAll` function from QuickCheck. This allows us
to generate a random string value for the `match` function, while still tying it
to the regex that we are testing.

To run the test we just pass it into the `quickCheck` function:

```ghci
λ= quickCheck test
+++ OK, passed 100 tests.
```

Now at the time of writing, I have already fixed the bugs associated with this
implementation, so we don't get to see QuickCheck in action giving a
counterexample. Lets intentionally introduce a bug in the `Mark` case and see if
QuickCheck can find it.

```hs
matchStream :: Regex -> String -> [String]
matchStream (Empty) syms        = [syms]
matchStream (Lit _) []          = []
matchStream (Lit c) (sym:syms)  = if c == sym then [syms] else []
matchStream (And re re')   syms = matchStream re syms >>= matchStream re'
matchStream (Or re re')    syms = matchStream re syms <> matchStream re' syms
matchStream (Mark re)      syms = matchStream re syms -- <> [syms]
matchStream (Plus re)      syms = matchStream re syms >>= matchStream (Star re)
matchStream star@(Star re) syms = (<> [syms]) $ do
    syms' <- matchStream re syms
    if syms' /= syms
       then matchStream star syms'
       else []
```

Running QuickCheck again:

```ghci
λ= quickCheck test
*** Failed! Falsified (after 8 tests):  
Mark (And (Mark (Plus (Lit 'L'))) (Mark (Or (Mark Empty) (Lit '-'))))
""
```

So it found the bug, and gave us a counterexample.  This is great, but the
counterexample is long and difficult to follow, especially if you don't know
what the issue really was. This is where QuickCheck's *shrinking* capability
comes in: when the test function finds a counterexample, it then runs the
`shrink` function to try out different variations of smaller inputs so that it
can give you better results.

Lets implement the shrink function for our `Arbitrary` instance:

```hs
instance Arbitrary Regex where
  ...

  shrink (Lit _)      = []
  shrink (Empty)      = []
  shrink (And re re') = shrinkTwo And re re'
  shrink (Or re re')  = shrinkTwo Or re re'
  shrink (Mark re)    = shrinkOne Mark re
  shrink (Star re)    = shrinkOne Star re
  shrink (Plus re)    = shrinkOne Plus re


shrinkOne :: Arbitrary a => (a -> a) -> a -> [a]
shrinkOne fn re = join [x, [re], fn <$> x]
  where x = shrink re


shrinkTwo :: Arbitrary a => (a -> a -> a) -> a -> a -> [a]
shrinkTwo fn re re' = join [x, [re], y, [re'], fn <$> x <*> y]
  where x = shrink re
        y = shrink re'
```

The shrink function for this instance is of type `hs|>Regex -> [Regex]`, the
idea being that for a given regex, we return a list of smaller values that
QuickCheck can test against to find a better counterexample.

The base cases are `Lit` and `Empty`, where we return empty lists, since these
are terminating values that can't be shrunk any further.

I also defined the `shrinkOne` function that lets us shrink a regex with a
single argument constructor, and `shrinkTwo` that does the same with a
two-argument constructor. In order, these return:
 - All the shrinks of the inner regex.
 - The original inner regex.
 - All the shrinks of the inner regex, within the original constructor.

By example:

```ghci
λ= shrink (Mark (Star (Lit 'a')))
[Lit 'a', Star (Lit 'a'), Mark (Lit 'a')]

λ= shrink (Or (Lit 'a') (Plus (Lit 'b')))
[Lit 'a', Lit 'b', Plus (Lit 'b')]
```

As you can see, when given a regex, the shrink function will generate all
combinations of sub-regex so that we can test against them.

With shrink defined, lets test the bugged version one more time to see if our
error output has improved:

```ghci
λ= quickCheck test
*** Failed! Falsified (after 9 tests and 1 shrink):
Mark (Mark (Lit 'S'))
""
```

This is certainly an improvement, but is still more complex than we'd hope - we
should only see a single `Mark` in our error output.

Taking a look at the verbose output gives us a hint to the issue:

```ghci
λ= quickCheck (verbose test)
...

Passed:
Mark (Lit 'S')
"S"

*** Failed! Falsified (after 9 tests and 1 shrink):
Mark (Mark (Lit 'S'))
""
```

When QuickCheck runs the tests again, its generating a single random string for
the input to the regex. As we can see you can get unlucky and generate a
matching string for the regex. In our example our bugged input should be `""`,
however for the `Mark (Lit 'S')` shrink the only input generated was `"S"`. To
improve the odds of getting a minimal counterexample, we can simply increase the
number of strings generated and passed to test our regex:

```hs
test :: Regex -> Property
test re = conjoin $ replicate 10 $ forAll (genString re) (match re)
```

Now instead of testing a single random input string, we generate 10. This makes
it significantly less likely that we will just skip over failing counterexamples
by generating the wrong string.

```ghci
λ= quickCheck test
*** Failed! Falsified (after 17 tests and 1 shrink):
Mark (Lit 'R')
""
```

Much better!


## Wrapping Up

So far, we've defined a basic regex syntax tree and interpreter for it, and
proven that it works with QuickCheck. This is a good first step, and if your
goal is just to define a working regex engine then this is all you need!

However there is a problem with this implementation: in a worst case scenario,
the runtime is exponential, as it has to backtrack through all possible
combinations of how the regex could match the string. This means that it becomes easy to build degenerate
regex that can take far longer than needed to match strings, since they get
caught up backtracking trying to find a match.

Fortunately, comp-sci comes to the rescue again! By doing
[Thompson's construction](https://en.wikipedia.org/wiki/Thompson%27s_construction)
on our regex, we can turn it into a
[deterministic finite automation](https://en.wikipedia.org/wiki/Deterministic_finite_automaton)
with a linear runtime. I will explore doing this construction and verifying it
with the testing infrastructure we have set up here in the next posts of this
series.
