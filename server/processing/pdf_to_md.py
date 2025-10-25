import pymupdf4llm
import os

pdf_path = "docs"
md_path = "md"

def pdf_to_md(input_file):
    input_path = os.path.join(pdf_path, input_file)
    output_file_name = input_file[:-4]+'.md'
    output_path = os.path.join(md_path, output_file_name)
    markdown_text = pymupdf4llm.to_markdown(input_path)
    with open(output_path, "w", errors='ignore') as f:
        f.write(markdown_text)

# Testing the function with dummy pdf
pdf_to_md("AWS Cloud Practictioner Course Notes.pdf")