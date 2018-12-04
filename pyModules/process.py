import json, os, re

curr_dir = os.path.dirname(os.path.realpath(__file__))
all_dir = [x[0] for x in os.walk(os.path.join(curr_dir, 'src'))]

arr = []

index = 0
for item in all_dir:
  if index == 0:
      index += 1
      continue
  dict = {}
  dict['question_theme'] = os.path.basename(item)
  
  all_candidate_files = [x for x in os.listdir(os.path.join(curr_dir, 'src', item)) if 'Test' not in x]
  print(all_candidate_files)

  
  for subfile in all_candidate_files:
    
    print(os.path.join(curr_dir, 'src', item, subfile))
    if 'TreeNode' in subfile:
      with open(os.path.join(curr_dir, 'src', item, subfile), 'r') as f:
        dict['tree_node'] = re.sub(r'\/\*([\S\s]+?)\*\/', '', f.read())
    else:
      try:
        with open(os.path.join(curr_dir, 'src', item, subfile), 'r') as f:
          temp_str = f.read()
          serious = temp_str[temp_str.index('/*') : temp_str.index('*/')+1]
          serious = serious[serious.index('\n'):]
          serious = serious[:serious.rindex('\n')+1]
          serious = serious.replace('\n *', '\n').replace('\n*', '\n')
          dict['question'] = serious.strip().strip('*').strip()
          dict['answer'] = re.sub(r'\/\*([\S\s]+?)\*\/', '', temp_str)
          break
      except:
        continue
  arr.append(dict)

with open ('output.json', 'w') as file:
  json.dump(arr, file)