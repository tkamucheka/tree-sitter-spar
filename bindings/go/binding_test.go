package tree_sitter_spar_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_spar "github.com/tkamucheka/tree-sitter-spar/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_spar.Language())
	if language == nil {
		t.Errorf("Error loading SPAR grammar")
	}
}
