PROJECT_NAME = agogochase
FILES = manifest.json js css icons images
XPI = $(PROJECT_NAME).xpi

.PHONY: all clean

all: $(XPI)

$(XPI): $(FILES)
	zip -r $@ $^

clean:
	rm -f $(XPI)
