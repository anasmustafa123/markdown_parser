there is two main steps in **programming language translation** 
1. tokenization
2. parsing

![image of programming language translation steps](https://i.ibb.co/cCxFnVr/plt-ilastration.png)

#### **Tokenization**

The first step in translation is tokenization. This process breaks down the input into small, manageable pieces called _tokens_. In Markdown, tokens are straightforward. For example:

- `#` denotes a header
- `*` represents a list item
- `[]()` is used for links

#### **Parsing and Creating the AST**

After tokenization, the next step is parsing, where we build an _Abstract Syntax Tree_ (AST). Each token is examined to determine its role in the document structure. For instance:

- A `#` at the beginning of a line signifies a header, and the text following it will be the header's content.
- A `*` at the start of a line indicates a list item, and these items will be grouped under a parent list node in the AST.

In this article, I will walk you through the concept of parsers, their importance, and how to build your own **Markdown parser**. We’ll begin by understanding what a parser is, then go step by step to create one that converts Markdown into HTML.

---

## Markdown Parsing

When it comes to Markdown specifically, the goal is to convert it into HTML, which uses opening and closing tags. To do this efficiently, a recursive approach to parsing can be useful.

![markdown parsing ilastration](https://i.ibb.co/PG03hSm/markdown-ilastration.png)
