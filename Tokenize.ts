type Token = {
  type: string;
  value: any;
};

class TokenizeMarkdown {
  content: string;
  updated_content: string;
  cursor: number;
  token_spec = [
    {
      TokenName: null,
      regex: /^[ \t]+/,
    },
    {
      TokenName: "Bold",
      regex: /^\*\*(.*)\*\*|^\_\_(.*)\_\_/,
    },
    {
      TokenName: "Italic",
      regex: /^\*(.*)\*|^\_(.*)\_/,
    },
    {
      TokenName: "Highlight",
      regex: /^\=\=(.*)\=\=/,
    },
    {
      TokenName: "OverLine",
      regex: /^\~\~(.*)\~\~/,
    },
    {
      TokenName: "UnderLine",
      regex: /^\~(.*)\~/,
    },
    {
      TokenName: "Code",
      regex: /^\`\`\`([^\n]*)([\s\S]*?)\`\`\`/,
    },
    {
      TokenName: "InlineCode",
      regex: /^\`(.*)\`/,
    },
    { TokenName: "Header", regex: /^(#+)\s(.*)/ },
    {
      TokenName: "BlockQuote",
      regex: /^\>(warning|error|success|tag)* (.*)/,
    },
    {
      TokenName: "OrderedList",
      regex: /^(1.\s.*?)((?=\n(?!([0-9]\. ))))/s,
      /* /1.\s(.*?)(?=\n(?!([0-9]\. )))/s */
    },
    /*  {
      TokenName: "UnorderedList",
      regex: /^-\s(.*?)(?=\n(?!-\s))/s,
    }, */
    {
      TokenName: "OrderedListItem",
      regex: /^\d. (.*?)/,
    },
    {
      TokenName: "UnorderedListItem",
      regex: /^- (.*)/,
    },
    {
      TokenName: "HorizontalLine",
      regex: /^\-[-]+(?=(\s*|\n))/,
    },
    {
      TokenName: "CheckBox",
      regex: /^\-\s\[(x| )\] (.*)/,
      /* /^\- \[(x*)\]/ */
    },
    {
      TokenName: "Link",
      regex: /^\[(.*?)\]\s*\((.*?)\)/,
      /* /^\[(.*)\]\((.*)\)/ */
    },
    {
      TokenName: "Image",
      regex: /^!\[(.*?)\]\s*\((.*?)\)/,
      /* /^\!\[(.*)\]\((.*)\)/ */
    },
    {
      TokenName: "NewLine",
      regex: /^(\n)/,
    },
    {
      TokenName: "Text",
      regex: /^(.*)/,
    },
  ];

  __init(content: string) {
    console.log(content);
    this.content = content;
    this.cursor = 0;
  }

  private has_more_tokens() {
    return this.cursor < this.content.length;
  }

  is_end_of_string() {
    return this.cursor === this.content.length;
  }

  private _match(
    token_name: string | null,
    regex_exp: RegExp,
    input_string: string
  ): string[] | null {
    const match_res = input_string.match(regex_exp);
    if (match_res === null) {
      return null;
    }
    if (token_name === "OrderedList") {
      this.cursor += match_res[1].length;
    } else this.cursor += match_res[0].length;
    return match_res;
  }

  get_next_token(): Token | null {
    this.updated_content = this.content.slice(this.cursor);
    let content_string = this.updated_content;
    /* console.log({ content_string }); */
    if (!this.has_more_tokens()) {
      return null;
    }

    for (const { TokenName, regex } of this.token_spec) {
      const match_res = this._match(TokenName, regex, content_string);
      if (match_res === null) {
        continue;
      }
      if (TokenName === null) {
        return this.get_next_token();
      }
      if (match_res) {
        if (TokenName === "Code") {
          return {
            type: TokenName,
            value: { content: match_res[2], lang: match_res[1].trim() },
          };
        } else if (TokenName === "BlockNote") {
          return {
            type: TokenName,
            value: { type: match_res[1] ? match_res[1] : "normal" },
          };
        } else if (TokenName === "Link") {
          return {
            type: TokenName,
            value: { href: match_res[2], alt: match_res[1] },
          };
        } else if (TokenName === "Image") {
          return {
            type: TokenName,
            value: { src: match_res[2], alt: match_res[1] },
          };
        } else if (TokenName === "CheckBox") {
          return {
            type: TokenName,
            value: { done: match_res[1] ? true : false },
          };
        } else if (TokenName === "OrderedList") {
          return {
            type: TokenName,
            value: match_res[2],
          };
        }
        return { type: TokenName, value: match_res[1] };
      }
    }
    return null;
  }

  constructor() {
    this.content = "";
    this.updated_content = "";
    this.cursor = 0;
  }
}

export default TokenizeMarkdown;