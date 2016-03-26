PROJECT_NAME = agogochase
FILES = chrome.manifest install.rdf content locale skin
XPI = $(PROJECT_NAME).xpi

.PHONY: all clean

all: $(XPI)

$(XPI): $(FILES)
	zip -r $@ $^

clean:
	rm -f $(XPI)
