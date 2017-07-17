
From the command line, convert all `.txt` files to `.csv`:

```bash
for f in *.txt; do
mv "$f" "${f%.txt}.csv"
done
```

Then, use a Perl script (also from the command line) to insert one "NAME,GENDER,COUNT" header into each file.
```bash
ls *.csv | xargs -n 1 perl -p -i -e 'print "NAME,GENDER,COUNT\n" if !m#^NAME,GENDER,COUNT#
&& !$h; $h = 1;'
```
