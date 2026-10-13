import XCTest
import SwiftTreeSitter
import TreeSitterSpar

final class TreeSitterSparTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_spar())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading SPAR grammar")
    }
}
