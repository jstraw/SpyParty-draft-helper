import json
import pathlib
import re

directory = pathlib.Path("web") / "data" / "props"


def get_pos(stack, data):
    d = data
    for x in stack:
        try:
            d = d[x]
        except KeyError:
            d[x] = {}
    return d

def generate_json_from_props(filename):
    stack = []
    data = {}
    print("hi")
    with open(filename, 'r', encoding="UTF=8") as fd:
        lines = fd.readlines()

    venue_ct = 0
    for line in lines:
        tokens = re.split(r"[\t =\"]+", line.rstrip())
        tokens = list(filter(None, tokens))
        print(tokens)
        if not len(tokens):
            continue
        elif tokens[0] == "group":
            stack.append(tokens[1])
            if "quickplay =" in line:
                print("enter venue")
                stack.append(f"venue{venue_ct}")
            print(f"Begin {stack}")
            get_pos(stack, data)["null"] = 1  # The first couple entries go the wrong place?!
            get_pos(stack, data)["null2"] = 2
        elif tokens[0] == "{" or "//" in tokens[0]:
            pass
        elif tokens[0] == "}":
            get_pos(stack,data).pop("null", None)  # cleanup the added nulls 
            get_pos(stack,data).pop("null2", None)
            sect = stack.pop()

            get_pos(stack,data).pop("null", None)
            get_pos(stack,data).pop("null2", None)
            if "venue" in sect:
                sect = f"{stack.pop()} - {sect}"
                venue_ct += 1
            print(f"End {sect}.")
        elif tokens[0] == "int":
            if "x" in tokens[2]:
                get_pos(stack, data)[tokens[1]] = int(tokens[2], 16)
            else:
                get_pos(stack, data)[tokens[1]] = int(tokens[2])
            print(f"parse {tokens} into {stack} for {get_pos(stack, data)}")
        elif tokens[0] == "string":
            get_pos(stack, data)[tokens[1]] = ' '.join(tokens[2:])
        elif tokens[0] == "strings":
            if tokens[1] not in get_pos(stack, data).keys():
                get_pos(stack, data)[tokens[1]] = []
            get_pos(stack, data)[tokens[1]].append(" ".join(tokens[2:]))

    if "SCL" in data["quickplays"]["custom_group"]["Name"]:
        return data, data
    cleaned_data = {"custom_group": data["quickplays"]["custom_group"]}
    cleaned_data["venuesets"] = {}
    for _, entry in data["quickplays"]["quickplay"].items():
        print(entry)
        m, venueset = entry["Name"].split(' - ')
        if venueset not in cleaned_data["venuesets"]:
            cleaned_data["venuesets"][venueset] = {}
        cleaned_data["venuesets"][venueset][m.split()[1]] = entry

    return data, cleaned_data

for f in directory.glob("*.prop"):
    prop, clean = generate_json_from_props(f)
    with open(f"{f.parents[0] / f.stem}_full.json", 'w', encoding="UTF-8") as fd:
        json.dump(prop, fd, indent=2)
    with open(f"{f.parents[0] / f.stem}.json", 'w', encoding="UTF-8") as fd:
        json.dump(clean, fd, indent=2)