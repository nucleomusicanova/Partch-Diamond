all: plug

plug:
	hvcc Pluck.pd -n plug -o plug -g js
	cp plug/js/* ./
	rm -rf plug
	
