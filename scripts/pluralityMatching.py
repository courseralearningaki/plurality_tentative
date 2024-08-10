plurality_symbol = "⿻"
from bs4 import BeautifulSoup
import os
import re
from tokenize import tokenize, STRING, NAME, OP
from io import BytesIO
import pandas as pd
def find_segments_with_separator(in_string, separator="⿻"):

    # pattern = re.compile(rf"(\b\w+\b \b\w+\b){separator}(\b\w+\b \b\w+\b)")
    # pattern = re.compile(rf"((?:\w*\s*\w*\s*){{1,2}})⿻((?:\w*\s*\w*\s*\w*\s*){{1,3}})")
    # pattern_search = re.search(rf"((?:\w*\s*\w*\s*){{1,2}})⿻((?:\w*\s*\w*\s*\w*\s*){{1,3}})")
    # re.findall(rf"((?:\w*\s*\w*\s*){{1,2}}){separator}((?:\w*\s*\w*\s*\w*\s*){{1,3}})", string)

    all_matches = []

    all_blocks = [[m.span()[0], m.span()[1]] for m in re.finditer("⿻", in_string)]


    for index, ( before, after ) in enumerate(all_blocks):

        start_pos = before - 40
        if start_pos < 0:
            start_pos = 0

        end_pos = after + 40
        if end_pos > len(in_string) :
            end_pos = len(in_string)


        tokenized_string = in_string[start_pos:before]
        tokenized_string = remove_non_alphabet_and_make_uppercase(tokenized_string)
        # tokens = tokenize.tokenize(BytesIO(tokenized_string.encode('utf-8')).readline)
        tokens = tokenize(BytesIO(tokenized_string.encode('utf-8')).readline)
        tokenized_stack = []
        for tnumber, tvalue, start, end, phisical_line in tokens:
            if tnumber == NAME:
                if tvalue == "⿻":
                    tvalue = ".+?"
                tokenized_stack.append(tvalue)
        if start_pos == 0:
            before_string = " ".join(tokenized_stack)
        else:
            before_string = " ".join(tokenized_stack[1:])
        tokenized_string = in_string[after:end_pos]
        tokenized_string = remove_non_alphabet_and_make_uppercase(tokenized_string)
        tokens = tokenize(BytesIO(tokenized_string.encode('utf-8')).readline)
        tokenized_stack = []

        for tnumber, tvalue, start, end, phisical_line in tokens:
            if tnumber == NAME:
                if tvalue == "⿻":
                    tvalue = ".+?"
                tokenized_stack.append(tvalue)

        after_string = " ".join(tokenized_stack[:-1])
        all_matches.append([before_string ,after_string])
    return all_matches

def remove_non_alphabet_and_make_uppercase(in_string):
    import string
    uppered = in_string.translate(str.maketrans({"\n":" "}))
    uppered = re.sub(r'\[\d*\]','', uppered)
    uppered = uppered.translate(str.maketrans('', '',  string.punctuation))
    uppered = uppered.translate(str.maketrans('', '', "“"))

    return uppered

if __name__ == '__main__':

    df_columns = [  'section', 'before', 'after', 'segment_before_found', 'segment_after_found',
                    "before_found_string", "after_found_string",
                    'all_found_before', 'all_latter_words_before' , 'found_before',
                    'all_found_after', 'all_latter_words_after', 'found_after'
                    'found_regex_before','found_regex_after',
                  ]
    df_word_use_index = pd.DataFrame(columns=df_columns)


    folder_all = "chapters"
    files = os.listdir(folder_all)
    files_file = [
        f for f in os.listdir(folder_all) if os.path.isfile(os.path.join(folder_all, f))
    ]
    import glob
    files_file = glob.glob(folder_all+'/**', recursive=True)
    for file_name in files_file:
        if ("eng\\index.html" in file_name):
            print(f"\nfilename:{file_name}")
            chapter_id = re.findall('.*?(\d{1}-\d{1}).*?', file_name)
            with (open(os.path.join(file_name), 'r', encoding="utf-8") as file):
                data = file.read()

                soup = BeautifulSoup(data, 'html.parser')
                # title_text = soup.find('div', {'id':'version-md'} ).get_text()
                footnote_index = [ind for ind, a in enumerate(soup.find('div', {'id': 'version-md'}).contents) if
                 ("class" in a.attrs) and a.attrs['class'] == ["footnotes"]]
                text_list = [a.text for a in soup.find('div', {'id': 'version-md'}).contents]
                if len(footnote_index) > 0:
                    del text_list[footnote_index[0]]
                title_text = " ".join(text_list)
                title_text = remove_non_alphabet_and_make_uppercase(title_text)
                segments = find_segments_with_separator(title_text)
                text_data = ""
                if len(chapter_id) == 1:
                    if (os.path.exists(os.path.join("plurality",chapter_id[0]+".txt"))):
                        with open(os.path.join("plurality",chapter_id[0]+".txt"), 'r', encoding="utf-8") as textfile:
                            text_data = textfile.read()
                            text_data = remove_non_alphabet_and_make_uppercase(text_data)
                            print("============{}============".format(chapter_id[0]))

                for before, after in segments:
                    segment_before_found = False
                    segment_after_found = False

                    before_text = before
                    after_text = after

                    all_found_before = []
                    all_latter_words_before = []
                    found_before = []

                    all_found_after = []
                    all_latter_words_after = []
                    found_after = []

                    found_regex_before = False
                    found_regex_after = False

                    print(f"\n{before:40} | {after:40}",end="")
                    if before == "":
                        print("Start at 0",end="")
                    elif before in text_data:
                        # print("before found",end="")
                        all_found_before = [[m.span()[0], m.span()[1]] for m in re.finditer(before+"\s*(\w*)",text_data)]
                        all_latter_words_before = [m for m in re.findall(before + "\s*(\w*)", text_data)]
                        if len(all_found_before) != 0:
                            print(all_found_before,all_latter_words_before[0],end="")
                        segment_before_found = True
                    else:
                        before = before.translate(str.maketrans({" ":"\s*"}))
                        found_before = re.findall(before, text_data, flags=re.IGNORECASE)
                        if len(found_before) != 0:
                            print("before found (regex)", end="")
                            segment_before_found = True
                            found_regex_before = True

                    if after in text_data:
                        # print("after found",end="")
                        segment_after_found = True
                        if segment_before_found == False:
                            all_found_after = [[m.span()[0], m.span()[1]] for m in re.finditer("(\w*)\s*"+after,text_data)]
                            all_latter_words_after = [m for m in re.findall("(\w*)\s*"+after, text_data)]
                            if len(all_found_after) != 0:
                                print("afterfound:",all_found_after,all_latter_words_after[0],end="")

                    else:
                        # re.escape
                        after = after.translate(str.maketrans({" ":"\s*"}))
                        found_after = re.findall(after, text_data, flags=re.IGNORECASE)
                        if len(found_after) != 0:
                            # print("after found (regex)", end="")
                            segment_after_found = True
                            found_regex_after = True

                    if (segment_before_found):
                        before_found_string = "X"
                    else:
                        before_found_string = "-"
                    if (segment_after_found):
                        after_found_string = "X"
                    else:
                        after_found_string = "-"

                    print(f"[{before_found_string}/{after_found_string}]",end="")
                    if (segment_before_found == False or segment_after_found == False):
                        print(f"--partly NOT found",end="")
                    if (segment_before_found == False and segment_after_found == False):
                        print(f"-------------------ENTIRELY NOT found", end="")

                    tmp_se = pd.Series({

                        'section': chapter_id[0],
                        'before':before_text,
                        'after':after_text
                        , 'segment_before_found':segment_before_found,
                        'segment_after_found':segment_after_found,
                        "before_found_string":before_found_string ,
                        "after_found_string": after_found_string,
                        'all_found_before':all_found_before,
                        'all_latter_words_before':all_latter_words_before,
                        'found_before':found_before,
                        'all_found_after':found_after,
                        'all_latter_words_after': all_latter_words_after,
                        'found_after': found_after,
                        'found_regex_before':found_regex_before,
                        'found_regex_after':found_regex_after,

                    }, index=df_word_use_index.columns)
                    df_word_use_index = pd.concat([df_word_use_index, tmp_se.to_frame().T], ignore_index=True)
                    # df_word_use_index = df_word_use_index.append(tmp_se, ignore_index=True)

df_word_use_index.to_csv(os.path.join("mapping.txt"), index=False,sep="\t")
print("all comparison completed")